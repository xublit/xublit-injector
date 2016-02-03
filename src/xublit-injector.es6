import 'babel-polyfill';

import EventEmitter from 'events';

import * as path from 'path';
import * as util from 'util';

import ModuleWrapper from './module-wrapper';
import ModuleBootstrapScope from './module-bootstrap-scope';

import * as __ from './constants';
import { loadModulesIn } from './module-loader';
import { missingDependencyHandler } from './missing-dependency-handler';

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
            missingDependencyHandler: missingDependencyHandler,
            moduleLoader: loadModulesIn,
            bootstrapScopeVars: {},
        };

        var bootstrapScopeVars = {
            injector: this,
        };

        Object.keys(defaults).forEach((key) => {

            var value = key in opts ? opts[key] : defaults[key];

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

                case 'bootstrapScopeVars':
                    value = Object.assign(
                        {}, 
                        defaults[key], 
                        opts[key] || {},
                        bootstrapScopeVars
                    );
                    break;

            }

            Object.defineProperty(this, key, {
                value: value,
                enumerable: true,
            });

        });

        Object.defineProperties(this, {

            moduleWrapperRefs: {
                value: new Map(),
                enumerable: true,
            },

            loadedModules: {
                value: [],
                enumerable: true,
            },

            wrappedModules: {
                value: [],
            },

            bootstrapScope: {
                value: new ModuleBootstrapScope(this.bootstrapScopeVars),
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

    defineModuleWrapperRef (ref, moduleWrapper) {
        this.moduleWrapperRefs.set(ref, moduleWrapper);
    }

    loadModules () {

        var loadedModules = this.moduleLoader(this.includeDirs) || [];

        Array.prototype.push.apply(
            this.loadedModules, 
            loadedModules
        );

        return this;

    }

    wrapLoadedModules () {

        this.loadedModules.forEach((module) => {

            var d = new ModuleWrapper(module);

            d.setBootstrapScope(this.bootstrapScope);

            this.wrappedModules.push(d);

            if (true === d.isInjectableAsInstance) {
                this.defineModuleWrapperRef(d.instanceRef, d);
            }

            if (true === d.isInjectableAsClass) {
                this.defineModuleWrapperRef(d.classRef, d);
            }

        });

        return this;

    }

    bootstrapWrappedModules () {

        this.wrappedModules.forEach((module) => {
            this.bootstrapModule(module);
        });

        return this;

    }

    bootstrap () {
        
        this.loadModules()
            .wrapLoadedModules()
            .bootstrapWrappedModules();

        this.emit('bootstrapped');

    }

    bootstrapModule (module) {

        if (module.isBootstrapped) {
            return module;
        }

        module.bootstrap(this.resolveModuleDependencies(module));

        return module;

    }

    injectable (ref) {

        var wrapperRefs = this.moduleWrapperRefs;

        if (!wrapperRefs.has(ref)) {
            throw new Error(util.format(
                'Module for "%s" does not exist or has not been loaded yet', ref
            ));
        }

        var module = wrapperRefs.get(ref);

        if (false === module.isBootstrapped) {
            throw new Error(util.format(
                'Module for "%s" has not been bootstrapped yet', ref
            ));
        }

        return module
            .injectableFor(ref)
            .injectable;

    }

    resolveModuleDependencies (module) {

        var moduleRef = module.ref;
        var dependencyRefs = module.dependencyRefs;

        if (!dependencyRefs || dependencyRefs.length < 1) {
            return [];
        }

        return dependencyRefs.map((dependencyRef, index) => {

            if ('' === dependencyRef) {
                throw new Error(util.format(
                    __.ERROR_MESSAGE_NONAME_DEPENDENCY, index
                ));
            }

            var dependency = this.moduleWrapperRefs.get(dependencyRef);

            if (undefined === dependency) {
                return this.missingDependencyHandler(
                    moduleRef,
                    dependencyRef,
                    index
                );
            }

            return this
                .bootstrapModule(dependency)
                .injectableFor(dependencyRef)
                .injectable;

        });

    }

}
