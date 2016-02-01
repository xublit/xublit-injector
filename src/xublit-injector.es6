import 'babel-polyfill';

import EventEmitter from 'events';

import * as path from 'path';
import * as util from 'util';

import ModuleWrapper from './module-wrapper';

import * as __ from './constants';
import defaultModuleLoader from './module-loader';

export default class Injector extends EventEmitter {

    constructor (opts) {

        super();

        opts = opts || {};

        if (!opts.baseDir) {
            throw new Error('Missing "baseDir" option');
        }

        var defaults = {
            baseDir: '',
            coreModuleName: __.DEFAULT_CORE_MODULE_NAME,
            includeDirs: [
                path.join(opts.baseDir, 'node_modules', 'xublit*'), 
                path.join(opts.baseDir, 'src'),
            ],
            missingDependencyHandler: function () { },
            moduleLoader: defaultModuleLoader,
        };

        Object.keys(defaults).forEach((key) => {

            var value = key in opts ? opts[key] : defaults[key];
            var writable = false;
            var enumerable = true;

            switch (key) {

                case 'includeDirs':
                    Injector.assertValidIncludeDirs(value);
                    value = value.slice(0);
                    break;

                case 'moduleLoader':
                    // no break

                case 'missingDependencyHandler':
                    if ('function' !== typeof value) {
                        throw new TypeError(util.format(
                            __.ERROR_MESSAGE_INVALID_FUNCTION_FOR, key
                        ));
                    }
                    break;

            }

            Object.defineProperty(this, key, {
                value: value,
                writable: false,
                enumerable: true,
            });

        });

        Object.defineProperties(this, {

            modulesByDependencyRef: {
                value: new Map(),
                writable: false,
                enumerable: true,
            },

            loadedModules: {
                value: [],
                writable: false,
                enumerable: true,
            },

        });

    }

    static assertValidIncludeDirs (includeDirs) {

        if (!Array.isArray(includeDirs)) {
            throw new TypeError(__.ERROR_MESSAGE_INCL_DIRS_NOT_ARRAY);
        }

        includeDirs.forEach((includeDir) => {
            if (!path.isAbsolute(includeDir)) {
                throw new Error(util.format(
                    __.ERROR_MESSAGE_RELATIVE_INCL_DIR, includeDir
                ));
            }
        });

    }

    bootstrap () {

        var loadedModules = this.moduleLoader(this.includeDirs) || [];

        Array.prototype.push.apply(
            this.loadedModules, 
            loadedModules
        );
        
        loadedModules.forEach((module) => {

            var dependency = new ModuleWrapper(module);

            if (false === dependency.instanceOnly) {
                this.modulesByDependencyRef.add(dependency.classRef, dependency);
            }

            this.modulesByDependencyRef.add(dependency.instanceRef, dependency);

        });

        this.modulesByDependencyRef.forEach((dependency, ref) => {
            this.parse(dependency, ref);
        });

        this.emit('bootstrapped');

    }

    parse (dependency, ref) {

        if (dependency.isBootstrapped()) {
            return dependency.injectableFor(ref);
        }

        var resolvedDependencies = this.resolveDependencies(
            ref,
            dependency.dependencyRefs
        );

    }

    moduleForDependencyRef (ref) {
        return this.modulesByDependencyRef.get(dependencyRef);
    }

    resolveDependencies (moduleRef, dependencyRefs) {

        if (!dependencyRefs || dependencyRefs.length < 1) {
            return [];
        }

        return dependencyRefs.map((dependencyRef, index) => {

            if ('' === dependencyRef) {
                throw new Error(util.format(
                    __.ERROR_MESSAGE_NONAME_DEPENDENCY, index
                ));
            }

            var module = this.moduleForDependencyRef(dependencyRef);

            if (undefined === module) {
                return this.missingDependencyHandler(
                    moduleRef,
                    dependencyRef,
                    index
                );
            }

            return module
                .bootstrap()
                .injectableFor(dependencyRef);

        });

    }

    resolveDependencyRefs (refs) {

        var resolvedDependencies;

        resolvedDependencies = this.resolveDependencies(
            dependency.dependencies
        );

        resolvedDependencies.forEach((resolvedDependency, i) => {

            var dependencyUnmet = undefined === resolvedDependency;
            if (dependencyUnmet) {
                throw new Error(util.format(
                    __.ERROR_MESSAGE_UNDEFINED_DEPENDENCY, refs[i]
                ));
            }

            if (!resolvedDependency.isBootstrapped) {
                let resolvedRef = resolvedDependency.dependencies[i];
                this.parse(this.dependency(resolvedRef), resolvedRef);
            }

        });

        return resolvedDependencies;

    }

}
