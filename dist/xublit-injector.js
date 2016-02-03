/**
 * Injector for Xublit
 * @version v1.0.0-rc.1
 * @link https://github.com/xublit/xublit-injector
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

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

var _constants = require('./constants');

var __ = _interopRequireWildcard(_constants);

var _moduleLoader = require('./module-loader');

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
            missingDependencyHandler: function missingDependencyHandler() {},
            moduleLoader: _moduleLoader.loadModulesIn
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

            }

            Object.defineProperty(_this, key, {
                value: value,
                enumerable: true
            });
        });

        Object.defineProperties(_this, {

            moduleWrapperRefs: {
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
        key: 'loadModules',
        value: function loadModules() {

            var loadedModules = this.moduleLoader(this.includeDirs) || [];

            Array.prototype.push.apply(this.loadedModules, loadedModules);

            return this;
        }
    }, {
        key: 'wrapLoadedModules',
        value: function wrapLoadedModules() {
            var _this2 = this;

            this.loadedModules.forEach(function (module) {

                var d = new _moduleWrapper2.default(module);

                d.provideInjector(_this2);

                _this2.wrappedModules.push(d);

                if (true === d.isInjectableAsInstance) {
                    _this2.defineModuleWrapperRef(d.instanceRef, d);
                }

                if (true === d.isInjectableAsClass) {
                    _this2.defineModuleWrapperRef(d.classRef, d);
                }
            });

            return this;
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

            this.loadModules().wrapLoadedModules().bootstrapWrappedModules();

            this.emit('bootstrapped');
        }
    }, {
        key: 'bootstrapModule',
        value: function bootstrapModule(module) {

            if (module.isBootstrapped) {
                return module;
            }

            module.bootstrap(this.resolveModuleDependencies(module));

            return module;
        }
    }, {
        key: 'injectable',
        value: function injectable(ref) {

            var wrapperRefs = this.moduleWrapperRefs;

            if (!wrapperRefs.has(ref)) {
                throw new Error(util.format('Module for "%s" does not exist or has not been loaded yet', ref));
            }

            var module = wrapperRefs.get(ref);

            if (false === module.isBootstrapped) {
                throw new Error(util.format('Module for "%s" has not been bootstrapped yet', ref));
            }

            return module.injectableFor(ref).injectable;
        }
    }, {
        key: 'resolveModuleDependencies',
        value: function resolveModuleDependencies(module) {
            var _this4 = this;

            var moduleRef = module.ref;
            var dependencyRefs = module.dependencyRefs;

            if (!dependencyRefs || dependencyRefs.length < 1) {
                return [];
            }

            return dependencyRefs.map(function (dependencyRef, index) {

                if ('' === dependencyRef) {
                    throw new Error(util.format(__.ERROR_MESSAGE_NONAME_DEPENDENCY, index));
                }

                var dependency = _this4.moduleWrapperRefs.get(dependencyRef);

                if (undefined === dependency) {
                    return _this4.missingDependencyHandler(moduleRef, dependencyRef, index);
                }

                return _this4.bootstrapModule(dependency).injectableFor(dependencyRef).injectable;
            });
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
    }]);

    return Injector;
}(_events2.default);

exports.default = Injector;
//# sourceMappingURL=xublit-injector.js.map
