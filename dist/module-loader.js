/**
 * Injector for Xublit
 * @version v1.0.0-rc.3
 * @link https://github.com/xublit/xublit-injector
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parsePath = parsePath;
exports.wildcardDirnameToRegExp = wildcardDirnameToRegExp;
exports.loadModulesIn = loadModulesIn;
exports.isInjectorModule = isInjectorModule;

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function parsePath(includeDirPath) {

    var searchDir;
    var includeDirs;

    var pathParts = includeDirPath.split(path.sep);
    if (pathParts.slice(0).pop().indexOf('*') > -1) {
        includeDirs = wildcardDirnameToRegExp(pathParts.pop());
    }

    searchDir = pathParts.join(path.sep);

    return {
        searchDir: searchDir,
        includeDirs: includeDirs
    };
}

function wildcardDirnameToRegExp(dirname) {
    return new RegExp('^' + dirname.replace('*', '[A-Z-_.]+') + '$', 'i');
}

function loadModulesIn(includeDirPaths) {

    var potentials = {};
    var modules = [];

    includeDirPaths.forEach(function (includeDirPath) {

        var parsedPath = parsePath(includeDirPath);

        var searchDir = parsedPath.searchDir;
        var opts = {};

        if (parsedPath.includeDirs) {
            opts.includeDirs = parsedPath.includeDirs;
        }

        Object.assign(potentials, findXublits(searchDir, opts));
    });

    Object.values(potentials).forEach(function (module) {

        if (!isInjectorModule(module)) {
            return;
        }

        modules.push(module);
    });

    return modules;
}

function isInjectorModule(module) {

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

function findXublits(dirname, opts) {

    opts = opts || {};

    var potentialsInThisDir = {};
    var includeDirs = 'includeDirs' in opts ? opts.includeDirs : /^[^\.]{1,2}/;
    var recursive = 'recursive' in opts ? opts.recursive : true;

    function includeDirectory(dirname) {
        return recursive || includeDirs.test(dirname);
    }

    var filenames = fs.readdirSync(dirname);

    filenames.forEach(function (filename) {

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
            includeDirs: includeDirs
        });

        Object.assign(potentialsInThisDir, potentialsInSubDirs);
    });

    return potentialsInThisDir;
}

function tryToRequire(path) {
    try {
        return require(path);
    } catch (error) {
        if ('MODULE_NOT_FOUND' === error.code) {
            return undefined;
        }
        throw error;
    }
}
//# sourceMappingURL=module-loader.js.map
