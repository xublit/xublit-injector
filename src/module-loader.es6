import * as path from 'path';

export function defaultModuleLoader (includeDirPaths) {

    var potentials = {};
    var modules = [];

    includeDirPaths.forEach((includeDirPath) => {

        var dirname;
        var includeDirs;

        var pathParts = includeDirPath.split(path.sep);

        if (pathParts.slice(0).pop().substr('*') > -1) {
            includeDirs = new RegExp(
                '^[^\.]{1,2}' + pathParts.pop().replace('*', '[A-Z-_.]+'),
                'i'
            );
        }

        dirname = pathParts.join(path.sep);

        Object.assign(potentials, findXublits(dirname, {
            includeDirs: includeDirs,
        }));

    });

    potentials.forEach((module) => {

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

    if (!module.name) {
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

    var fs = require('fs');
    
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