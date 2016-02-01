import 'babel-polyfill';

import path from 'path';
import EventEmitter from 'events';

import * as __ from './constants';

import ModuleWrapper from './module-wrapper';
import { includeModulesFrom } from './module-loader';

export default class Injector extends EventEmitter {

    constructor (opts) {

        super();

        opts = opts || {};

        if (!opts.rootDir) {
            throw new Error('Missing "rootDir" option');
        }

        var defaults = {
            coreModuleName: __.DEFAULT_CORE_MODULE_NAME,
            moduleLoader: includeModulesFrom,
            missingDependencyHandler: undefined,
            includeDirs: [
                path.join(opts.rootDir, 'node_modules', 'xublit*'), 
                path.join(opts.rootDir, 'src'),
            ],
        };

        Object.keys(defaults).forEach((key) => {
            Object.defineProperty(this, key, {
                value: key in opts ? opts[key] : defaults[key],
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

            modules: {
                value: [],
                writable: false,
                enumerable: true,
            },

        });

    }

    bootstrap () {

        Array.prototype.push.apply(
            this.modules, 
            this.moduleLoader.findAllIn(this.includeDirs)
        );
        
        this.modules.forEach((module) => {

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

        try {

            resolvedDependencies = this.resolveDependencies(
                dependency.dependencies
            );

            resolvedDependencies.forEach((resolvedDependency, i) => {

                var dependencyUnmet = undefined === resolvedDependency;
                if (dependencyUnmet) {
                    throw new Error(util.format(
                        ERROR_MESSAGE_UNMET_DEPENDENCY, resolvedDependency
                    ));
                }

                if (!resolvedDependency.isBootstrapped) {
                    let resolvedRef = resolvedDependency.dependencies[i];
                    this.parse(this.dependency(resolvedRef), resolvedRef);
                }

            });
            
        }
        catch (error) {
            this.handle(ERR_DEP_RESOLUTION_FAILED, error, dependency, ref);
        }

        return resolvedDependencies;

    }



}
