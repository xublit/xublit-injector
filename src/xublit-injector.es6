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

            moduleWrapperRefOverrides: {
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

    static wrapModule (module, ref, bootstrapScope) {
        var moduleWrapper = new ModuleWrapper(module, ref);
        moduleWrapper.setBootstrapScope(bootstrapScope);
        return moduleWrapper;
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

    override (ref, moduleWrapper) {

        if ('string' !== typeof ref) {
            throw new TypeError(util.format(
                'Expecting string as 1st argument, got %s', typeof ref
            ));
        }

        if (!(moduleWrapper instanceof ModuleWrapper)) {

            let varType = moduleWrapper.constructor &&
                moduleWrapper.constructor.name ||
                typeof moduleWrapper;

            throw new TypeError(util.format(
                'Expecting a ModuleWrapper as 2nd argument, got %s', varType
            ));

        }

        this.moduleWrapperRefOverrides.set(ref, moduleWrapper);

        if (!moduleWrapper.isBootstrapped) {
            moduleWrapper.bootstrap
        }

        return this;

    }

    wrapLoadedModules () {

        this.loadedModules.forEach((module) => {

            var defaultScopeVars = this.bootstrapScopeVars;
            var bootstrapScopeVars = Object.create(defaultScopeVars);

            if ('function' === typeof defaultScopeVars.$options) {
                bootstrapScopeVars.$options = defaultScopeVars.$options(
                    module.ref
                );
            }

            var d = Injector.wrapModule(
                module,
                module.ref,
                new ModuleBootstrapScope(bootstrapScopeVars)
            );

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

    get modulesLoaded () {
        return this.loadedModules.length > 0;
    }

    get allModulesWrapped () {
        return this.loadedModules.length === this.wrappedModules.length;
    }

    bootstrap () {

        if (!this.modulesLoaded) {
            this.loadModules();
        }

        if (!this.allModulesWrapped) {
            this.wrapLoadedModules();
        }
        
        this.bootstrapWrappedModules()
            .emit('bootstrapped');

    }

    bootstrapModule (moduleWrapper) {

        if (moduleWrapper.isBootstrapped) {
            return moduleWrapper;
        }

        return moduleWrapper.bootstrap(
            resolveModuleDependencies(moduleWrapper, this)
        );

    }

    hasModule (ref) {
        return this.moduleWrapperRefs.has(ref);
    }

    getModule (ref) {

        if (this.hasOverrideForModule(ref)) {
            return this.getOverrideForModule(ref);
        }

        if (!this.hasModule(ref)) {
            throw new Error(util.format(
                'Module for "%s" does not exist or has not been loaded yet', ref
            ));
        }

        return this.moduleWrapperRefs.get(ref);

    }

    hasOverrideForModule (ref) {
        return this.moduleWrapperRefOverrides.has(ref);
    }

    getOverrideForModule (ref) {
        return this.moduleWrapperRefOverrides.get(ref);
    }

    injectable (ref) {

        var module = this.getModule(ref);

        if (false === module.isBootstrapped) {
            throw new Error(util.format(
                'Module for "%s" has not been bootstrapped yet', ref
            ));
        }

        return module
            .injectableFor(ref)
            .injectable;

    }

}

function resolveModuleDependencies (moduleWrapper, injector) {

    var moduleRef = moduleWrapper.ref;
    var dependencyRefs = moduleWrapper.dependencyRefs;

    if (!dependencyRefs || dependencyRefs.length < 1) {
        return [];
    }

    return dependencyRefs.map((dependencyRef, index) => {

        if ('' === dependencyRef) {
            throw new Error(util.format(
                __.ERROR_MESSAGE_NONAME_DEPENDENCY, index
            ));
        }

        var dependency = injector.getModule(dependencyRef);

        if (undefined === dependency) {
            return injector.missingDependencyHandler(
                moduleRef,
                dependencyRef,
                index
            );
        }

        return injector
            .bootstrapModule(dependency)
            .injectableFor(dependencyRef)
            .injectable;

    });

}
