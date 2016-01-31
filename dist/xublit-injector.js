'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Injector = undefined;

var _moduleWrapper = require('./module-wrapper');

var _moduleLoader = require('./module-loader');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var path = require('path');
var EventEmitter = require('events');

var rootAppPath = path.dirname(require.main.filename);
var DEFAULT_MODULES_PATH = path.join(DEFAULT_APP_ROOT_PATH, 'modules');

var defaults = {
    coreModuleName: '$app',
    moduleLoader: _moduleLoader.includeModulesFrom,
    missingDependencyHandler: undefined,
    includeDirs: [path.join(rootAppPath, 'node_modules', 'xublit*'), path.join(rootAppPath, 'src')]
};

var Injector = exports.Injector = function (_EventEmitter) {
    _inherits(Injector, _EventEmitter);

    function Injector(opts) {
        _classCallCheck(this, Injector);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Injector).call(this));

        opts = opts || {};

        Object.keys(defaults).forEach(function (key) {
            Object.defineProperty(this, key, {
                value: key in opts ? opts[key] : defaults[key],
                writable: false,
                enumerable: true
            });
        }, _this);

        Object.defineProperties(_this, {

            modulesByDependencyRef: {
                value: new Map(),
                writable: false,
                enumerable: true
            },

            modules: {
                value: [],
                writable: false,
                enumerable: true
            }

        });

        return _this;
    }

    _createClass(Injector, [{
        key: 'bootstrap',
        value: function bootstrap() {

            Array.prototype.push.apply(this.modules, this.moduleLoader.findAllIn(this.includeDirs));

            this.modules.forEach(function (module) {

                var dependency = new _moduleWrapper.ModuleWrapper(module);

                if (false === dependency.instanceOnly) {
                    this.modulesByDependencyRef.add(dependency.classRef, dependency);
                }

                this.modulesByDependencyRef.add(dependency.instanceRef, dependency);
            }, this);

            this.modulesByDependencyRef.forEach(function (dependency, ref) {
                this.parse(dependency, ref);
            }, this);

            this.emit('bootstrapped');
        }
    }, {
        key: 'parse',
        value: function parse(dependency, ref) {

            if (dependency.isBootstrapped()) {
                return dependency.injectableFor(ref);
            }

            var resolvedDependencies = this.resolveDependencies(ref, dependency.dependencyRefs);
        }
    }, {
        key: 'moduleForDependencyRef',
        value: function moduleForDependencyRef(ref) {
            return this.modulesByDependencyRef.get(dependencyRef);
        }
    }, {
        key: 'resolveDependencies',
        value: function resolveDependencies(moduleRef, dependencyRefs) {

            if (!dependencyRefs || dependencyRefs.length < 1) {
                return [];
            }

            return dependencyRefs.map(function (dependencyRef, index) {

                if ('' === dependencyRef) {
                    throw new Error(util.format(ERROR_MESSAGE_NONAME_DEPENDENCY, index));
                }

                var module = this.moduleForDependencyRef(dependencyRef);

                if (undefined === module) {
                    return this.missingDependencyHandler(moduleRef, dependencyRef, index);
                }

                return module.bootstrap().injectableFor(dependencyRef);
            }, this);
        }
    }, {
        key: 'resolveDependencyRefs',
        value: function resolveDependencyRefs(refs) {

            var resolvedDependencies;

            try {

                resolvedDependencies = this.resolveDependencies(dependency.dependencies);

                resolvedDependencies.forEach(function (resolvedDependency, i) {

                    var dependencyUnmet = undefined === resolvedDependency;
                    if (dependencyUnmet) {
                        throw new Error(util.format(ERROR_MESSAGE_UNMET_DEPENDENCY, resolvedDependency));
                    }

                    if (!resolvedDependency.isBootstrapped) {
                        var resolvedRef = resolvedDependency.dependencies[i];
                        this.parse(this.dependency(resolvedRef), resolvedRef);
                    }
                }, this);
            } catch (error) {
                this.handle(ERR_DEP_RESOLUTION_FAILED, error, dependency, ref);
            }

            return resolvedDependencies;
        }
    }]);

    return Injector;
}(EventEmitter);
//# sourceMappingURL=xublit-injector.js.map
