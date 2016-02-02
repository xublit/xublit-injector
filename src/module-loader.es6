import * as path from 'path';
import * as fs from 'fs';

export function parsePath (includeDirPath) {

    var searchDir;
    var includeDirs;

    var pathParts = includeDirPath.split(path.sep);
    if (pathParts.slice(0).pop().indexOf('*') > -1) {
        includeDirs = wildcardDirnameToRegExp(pathParts.pop());
    }

    searchDir = pathParts.join(path.sep);

    return {
        searchDir: searchDir,
        includeDirs: includeDirs,
    };

}

export function wildcardDirnameToRegExp (dirname) {
    return new RegExp(
        '^' + dirname.replace('*', '[A-Z-_.]+') + '$',
        'i'
    );
}

export function loadModulesIn (includeDirPaths) {

    var potentials = {};
    var modules = [];

    includeDirPaths.forEach((includeDirPath) => {

        var parsedPath = parsePath(includeDirPath);

        var searchDir = parsedPath.searchDir;
        var opts = {};

        if (parsedPath.includeDirs) {
            opts.includeDirs = parsedPath.includeDirs;
        }

        Object.assign(potentials, findXublits(searchDir, opts));

    });

    Object.values(potentials).forEach((module) => {

        if (!isInjectorModule(module)) {
            return;
        }

        modules.push(module);

    });

    return modules;

}

export function isInjectorModule (module) {
    
    if (!module) {
        return false;
    }

    if (!module.ref) {
        return false;
    }

    if (!module.bootstrap || 'function' !== typeof module.bootstrap) {
        return false;
    }

    if (!module.inject || !Array.isArray(module.inject)) {
        return false;
    }

    return true;

}

function findXublits (dirname, opts) {
    
    opts = opts || {};

    var potentialsInThisDir = {};
    var includeDirs = 'includeDirs' in opts ? opts.includeDirs : /^[^\.]{1,2}/;
    var recursive = 'recursive' in opts ? opts.recursive : true;

    function includeDirectory (dirname) {
        return recursive || includeDirs.test(dirname);
    }

    var filenames = fs.readdirSync(dirname);

    filenames.forEach((filename) => {

        var filepath = dirname + '/' + filename;

        var isDirectory = fs.statSync(filepath).isDirectory();
        if (!isDirectory) {

            var match = /\.(js|json|node|es6)$/i.test(filename);
            if (match) {
                var module = tryToRequire(filepath);
                if (module) {
                    potentialsInThisDir[filepath] = module;
                }
            }

            return;

        }

        var potentialsInSubDirs = findXublits(filepath, {
            includeDirs: includeDirs,
        });

        Object.assign(potentialsInThisDir, potentialsInSubDirs);

    });

    return potentialsInThisDir;

}

function tryToRequire (path) {
    try {
        return require(path);
    }
    catch (error) {
        if ('MODULE_NOT_FOUND' === error.code) {
            return undefined;
        }
        throw error;
    }
}