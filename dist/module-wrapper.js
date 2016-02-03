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

var _util = require('util');

var util = _interopRequireWildcard(_util);

var _injectableClass = require('./injectable-class');

var _injectableClass2 = _interopRequireDefault(_injectableClass);

var _injectableInstance = require('./injectable-instance');

var _injectableInstance2 = _interopRequireDefault(_injectableInstance);

var _util2 = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModuleWrapper = function () {
    function ModuleWrapper(xublitModule) {
        _classCallCheck(this, ModuleWrapper);

        if (!xublitModule.ref) {
            throw new Error('Invalid value for "ref" in xublitModule');
        }

        this.defineEnumerable('ref', xublitModule.ref).defineEnumerable('bootstrapFn', xublitModule.bootstrap).defineEnumerable('dependencyRefs', xublitModule.inject.slice(0));
    }

    _createClass(ModuleWrapper, [{
        key: 'provideInjector',
        value: function provideInjector(injector) {
            this.defineEnumerable('injector', injector);
            return this;
        }
    }, {
        key: 'defineEnumerable',
        value: function defineEnumerable(prop, value) {

            Object.defineProperty(this, prop, {
                value: value,
                enumerable: true
            });

            return this;
        }
    }, {
        key: 'injectableFor',
        value: function injectableFor(ref) {

            switch (ref) {
                case this.instanceRef:
                    return this.injectableInstance;
                case this.classRef:
                    return this.injectableClass;
            }
        }
    }, {
        key: 'bootstrap',
        value: function bootstrap(resolvedDependencies) {

            if (this.isBootstrapped) {
                return this;
            }

            assertValidDependencies(resolvedDependencies, this);

            this.defineEnumerable('bootstrapReturnValue', _bootstrap(this, this.bootstrapFn, resolvedDependencies));

            parseBootstrapReturnValueFor(this);

            return this;
        }
    }, {
        key: 'refTypeIdentifier',
        get: function get() {
            return this.ref.substr(0, 1);
        }
    }, {
        key: 'isAbstractClass',
        get: function get() {
            return (/^Abstract[A-Z]/.test(this.ref)
            );
        }
    }, {
        key: 'isOnlyInjectableAsInstance',
        get: function get() {
            return true === this.isInjectableAsInstance && false === this.isInjectableAsClass;
        }
    }, {
        key: 'isInjectableAsInstance',
        get: function get() {
            return false === this.isAbstractClass && '!' !== this.refTypeIdentifier;
        }
    }, {
        key: 'isInjectableAsClass',
        get: function get() {
            return this.isAbstractClass || /^[A-Z]$/.test(this.refTypeIdentifier);
        }
    }, {
        key: 'bootstrapped',
        get: function get() {
            return Boolean('_bootstrapped' in this && this._bootstrapped);
        }
    }, {
        key: 'numDependencies',
        get: function get() {
            return this.dependencyRefs.length;
        }
    }, {
        key: 'classRef',
        get: function get() {

            if (false === this.isInjectableAsClass) {
                return undefined;
            }

            return this.ref;
        }
    }, {
        key: 'instanceRef',
        get: function get() {

            if (false === this.isInjectableAsInstance) {
                return undefined;
            }

            if (true === this.isOnlyInjectableAsInstance) {
                return this.ref;
            }

            if (true === this.isInjectableAsClass) {
                return (0, _util2.instanceRef)(this.ref);
            }
        }
    }, {
        key: 'isBootstrapped',
        get: function get() {
            return undefined !== this.bootstrapReturnValue;
        }
    }]);

    return ModuleWrapper;
}();

exports.default = ModuleWrapper;

function assertValidDependencies(resolvedDependencies, moduleWrapper) {

    if (!Array.isArray(resolvedDependencies)) {
        throw new TypeError('Resolved dependencies must be an Array');
    }

    if (resolvedDependencies.length !== moduleWrapper.numDependencies) {
        throw new Error(util.format('resolvedDependencies mismatch: Expected %s, got %s', moduleWrapper.numDependencies, resolvedDependencies.length));
    }
}

function _bootstrap(moduleWrapper, bootstrapFn, resolvedDependencies) {

    var moduleRef = moduleWrapper.moduleRef;
    var bootstrapScope = {
        injector: function injector() {
            return moduleWrapper.injector;
        }
    };

    try {
        return bootstrapFn.call.apply(bootstrapFn, [bootstrapScope].concat(_toConsumableArray(resolvedDependencies)));
    } catch (error) {
        // Bootstrap failed while executing module's bootstrap function
        var originalErrorMsg = error.message;
        throw new Error(util.format('Failed to bootstrap module %s: %s', moduleRef, originalErrorMsg));
    }
}

function parseBootstrapReturnValueFor(moduleWrapper) {

    var ref = moduleWrapper.ref;
    var Module = moduleWrapper.bootstrapReturnValue;

    if (true === moduleWrapper.isInjectableAsClass) {
        moduleWrapper.defineEnumerable('injectableClass', new _injectableClass2.default(moduleWrapper));
    }

    if (true === moduleWrapper.isInjectableAsInstance) {
        moduleWrapper.defineEnumerable('injectableInstance', new _injectableInstance2.default(moduleWrapper));
    }
}
//# sourceMappingURL=module-wrapper.js.map
