/**
 * Injector for Xublit
 * @version v1.0.0-rc.3
 * @link https://github.com/xublit/xublit-injector
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('babel-polyfill');

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _util = require('util');

var util = _interopRequireWildcard(_util);

var _moduleWrapper = require('./module-wrapper');

var _moduleWrapper2 = _interopRequireDefault(_moduleWrapper);

var _moduleBootstrapScope = require('./module-bootstrap-scope');

var _moduleBootstrapScope2 = _interopRequireDefault(_moduleBootstrapScope);

var _constants = require('./constants');

var __ = _interopRequireWildcard(_constants);

var _moduleLoader = require('./module-loader');

var _missingDependencyHandler = require('./missing-dependency-handler');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Injector = function (_EventEmitter) {
    _inherits(Injector, _EventEmitter);

    function Injector(opts) {
        _classCallCheck(this, Injector);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Injector).call(this));

        opts = opts || {};

        if (!opts.baseDir) {
            throw new Error('Missing "baseDir" option');
        }

        var defaults = {
            baseDir: '',
            coreModuleName: __.DEFAULT_CORE_MODULE_NAME,
            includeDirs: [path.join(opts.baseDir, 'node_modules', 'xublit*'), path.join(opts.baseDir, 'src')],
            missingDependencyHandler: _missingDependencyHandler.missingDependencyHandler,
            moduleLoader: _moduleLoader.loadModulesIn,
            bootstrapScopeVars: {}
        };

        var bootstrapScopeVars = {
            injector: _this
        };

        Object.keys(defaults).forEach(function (key) {

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
                        throw new TypeError(util.format(__.ERROR_MESSAGE_INVALID_FUNCTION_FOR, key));
                    }
                    break;

                case 'bootstrapScopeVars':
                    value = Object.assign({}, defaults[key], opts[key] || {}, bootstrapScopeVars);
                    break;

            }

            Object.defineProperty(_this, key, {
                value: value,
                enumerable: true
            });
        });

        Object.defineProperties(_this, {

            injectables: {
                value: new Map(),
                enumerable: true
            },

            moduleWrapperRefs: {
                value: new Map(),
                enumerable: true
            },

            moduleWrapperRefOverrides: {
                value: new Map(),
                enumerable: true
            },

            loadedModules: {
                value: [],
                enumerable: true
            },

            wrappedModules: {
                value: []
            }

        });

        return _this;
    }

    _createClass(Injector, [{
        key: 'defineModuleWrapperRef',
        value: function defineModuleWrapperRef(ref, moduleWrapper) {
            this.moduleWrapperRefs.set(ref, moduleWrapper);
        }
    }, {
        key: 'defineInjectable',
        value: function defineInjectable(ref, injectable) {
            this.injectables.set(ref, injectable);
        }
    }, {
        key: 'loadModules',
        value: function loadModules() {

            var loadedModules = this.moduleLoader(this.includeDirs) || [];

            Array.prototype.push.apply(this.loadedModules, loadedModules);

            return this;
        }
    }, {
        key: 'override',
        value: function override(ref, moduleWrapper) {

            if ('string' !== typeof ref) {
                throw new TypeError(util.format('Expecting string as 1st argument, got %s', typeof ref === 'undefined' ? 'undefined' : _typeof(ref)));
            }

            if (!(moduleWrapper instanceof _moduleWrapper2.default)) {

                var varType = moduleWrapper.constructor && moduleWrapper.constructor.name || (typeof moduleWrapper === 'undefined' ? 'undefined' : _typeof(moduleWrapper));

                throw new TypeError(util.format('Expecting a ModuleWrapper as 2nd argument, got %s', varType));
            }

            this.moduleWrapperRefOverrides.set(ref, moduleWrapper);

            if (!moduleWrapper.isBootstrapped) {
                moduleWrapper.bootstrap;
            }

            return this;
        }
    }, {
        key: 'wrapLoadedModules',
        value: function wrapLoadedModules() {
            var _this2 = this;

            this.loadedModules.forEach(function (module) {
                _this2.wrapLoadedModule(module);
            });

            return this;
        }
    }, {
        key: 'provide',
        value: function provide(ref, dependencyRefs, bootstrapFn, bootstrapScopeVars) {

            var bootstrapFnScope = new _moduleBootstrapScope2.default(bootstrapScopeVars);

            var module = {
                inject: dependencyRefs,
                bootstrap: bootstrapFn
            };

            var d = new _moduleWrapper2.default(module, ref);

            d.setBootstrapScope(bootstrapFnScope);

            this.wrappedModules.push(d);

            if (true === d.isInjectableAsInstance) {
                this.defineModuleWrapperRef(d.instanceRef, d);
            }

            if (true === d.isInjectableAsClass) {
                this.defineModuleWrapperRef(d.classRef, d);
            }

            return this;
        }
    }, {
        key: 'wrapLoadedModule',
        value: function wrapLoadedModule(module) {

            var defaultScopeVars = this.bootstrapScopeVars;

            return this.provide(module.ref, module.inject, module.bootstrap, Object.create(defaultScopeVars));
        }
    }, {
        key: 'bootstrapWrappedModules',
        value: function bootstrapWrappedModules() {
            var _this3 = this;

            this.wrappedModules.forEach(function (module) {
                _this3.bootstrapModule(module);
            });

            return this;
        }
    }, {
        key: 'bootstrap',
        value: function bootstrap() {

            if (!this.modulesLoaded) {
                this.loadModules();
            }

            if (!this.allModulesWrapped) {
                this.wrapLoadedModules();
            }

            this.bootstrapWrappedModules().emit('bootstrapped');
        }
    }, {
        key: 'bootstrapModule',
        value: function bootstrapModule(moduleWrapper) {

            if (moduleWrapper.isBootstrapped) {
                return moduleWrapper;
            }

            moduleWrapper.bootstrap(resolveModuleDependencies(moduleWrapper, this));

            if (true === moduleWrapper.isInjectableAsInstance) {

                var ref = moduleWrapper.instanceRef;
                var injectable = moduleWrapper.injectableFor(ref).injectable;

                this.defineInjectable(ref, injectable);
            }

            if (true === moduleWrapper.isInjectableAsClass) {

                var ref = moduleWrapper.classRef;
                var injectable = moduleWrapper.injectableFor(ref).injectable;

                this.defineInjectable(ref, injectable);
            }

            return moduleWrapper;
        }
    }, {
        key: 'hasModule',
        value: function hasModule(ref) {
            return this.moduleWrapperRefs.has(ref);
        }
    }, {
        key: 'getInjectable',
        value: function getInjectable(ref) {
            return this.injectables.get(ref);
        }
    }, {
        key: 'getModule',
        value: function getModule(ref) {

            if (this.hasOverrideForModule(ref)) {
                return this.getOverrideForModule(ref);
            }

            if (!this.hasModule(ref)) {
                throw new Error(util.format('Module for "%s" does not exist or has not been loaded yet', ref));
            }

            return this.moduleWrapperRefs.get(ref);
        }
    }, {
        key: 'hasOverrideForModule',
        value: function hasOverrideForModule(ref) {
            return this.moduleWrapperRefOverrides.has(ref);
        }
    }, {
        key: 'getOverrideForModule',
        value: function getOverrideForModule(ref) {
            return this.moduleWrapperRefOverrides.get(ref);
        }
    }, {
        key: 'injectable',
        value: function injectable(ref) {

            if (undefined !== this.getInjectable(ref)) {
                return this.getInjectable(ref);
            }

            var module = this.getModule(ref);

            if (undefined === module) {
                throw new Error(util.format('Couldn\'t find injectable or module for ref "%s"', ref));
            }

            if (false === module.isBootstrapped) {
                throw new Error(util.format('Module for "%s" has not been bootstrapped yet', ref));
            }

            return undefined;
        }
    }, {
        key: 'modulesLoaded',
        get: function get() {
            return this.loadedModules.length > 0;
        }
    }, {
        key: 'allModulesWrapped',
        get: function get() {
            return this.loadedModules.length === this.wrappedModules.length;
        }
    }], [{
        key: 'assertValidIncludeDirs',
        value: function assertValidIncludeDirs(includeDirs) {

            if (!Array.isArray(includeDirs)) {
                throw new TypeError(__.ERROR_MESSAGE_INCL_DIRS_NOT_ARRAY);
            }

            includeDirs.forEach(function (includeDir) {
                if (!path.isAbsolute(includeDir)) {
                    throw new Error(util.format(__.ERROR_MESSAGE_RELATIVE_INCL_DIR, includeDir));
                }
            });
        }
    }, {
        key: 'wrapModule',
        value: function wrapModule(module, ref, bootstrapScope) {
            var moduleWrapper = new _moduleWrapper2.default(module, ref);
            moduleWrapper.setBootstrapScope(bootstrapScope);
            return moduleWrapper;
        }
    }]);

    return Injector;
}(_events2.default);

exports.default = Injector;

function resolveModuleDependencies(moduleWrapper, injector) {

    var moduleRef = moduleWrapper.ref;
    var dependencyRefs = moduleWrapper.dependencyRefs;

    if (!dependencyRefs || dependencyRefs.length < 1) {
        return [];
    }

    return dependencyRefs.map(function (dependencyRef, index) {

        if ('' === dependencyRef) {
            throw new Error(util.format(__.ERROR_MESSAGE_NONAME_DEPENDENCY, index));
        }

        var injectable = injector.getInjectable(dependencyRef);
        if (undefined !== injectable) {
            return injectable;
        }

        var moduleWrapper = injector.getModule(dependencyRef);
        if (undefined === moduleWrapper) {
            return injector.missingDependencyHandler(moduleRef, dependencyRef, index);
        }

        injector.bootstrapModule(moduleWrapper);

        return injector.injectable(dependencyRef);
    });
}
//# sourceMappingURL=xublit-injector.js.map
