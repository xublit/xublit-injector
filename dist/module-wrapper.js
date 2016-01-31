'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instanceRef = require('./util/instance-ref');

exports.ModuleWrapper = function () {
    function ModuleWrapper(xublitModule) {
        _classCallCheck(this, ModuleWrapper);

        Object.defineProperty(this, 'ref', {
            value: xublitModule.ref,
            writable: false,
            enumerable: true
        });

        Object.defineProperties(this, {

            ref: {
                value: xublitModule.ref,
                writable: false,
                enumerable: true
            },

            dependencyRefs: {
                value: xublitModule.inject.slice(0),
                writable: false,
                enumerable: true
            },

            bootstrapFn: {
                value: xublitModule.bootstrap,
                writable: false,
                enumerable: true
            },

            resolvedDependencies: {
                value: [],
                writable: false,
                enumerable: true
            }

        });
    }

    _createClass(ModuleWrapper, [{
        key: 'isBootstrapped',
        value: function isBootstrapped() {
            return true === this.bootstrapped;
        }
    }, {
        key: 'injectableFor',
        value: function injectableFor(ref) {

            switch (ref) {
                case this.instanceRef:
                    return this.bootstrappedInstance;
                case this.classRef:
                    return this.bootstrappedClass;
            }
        }
    }, {
        key: 'bootstrap',
        value: function bootstrap(resolvedDependencies) {

            if (true === this.bootstrapped) {
                return this;
            }

            if (!Array.isArray(resolvedDependencies)) {
                throw new TypeError('Resolved dependencies must be an Array');
            }

            assertDependencyCountMatch(this, resolvedDependencies);

            try {
                var Module = this.bootstrapFn.apply(this, _toConsumableArray(resolvedDependencies));
            } catch (error) {
                // Bootstrap failed while executing module's bootstrap function
            }

            Object.defineProperty(this, '_bootstrapped', {
                value: Module,
                writable: false,
                enumerable: true
            });

            if (false === this.instanceOnly) {
                Object.defineProperty(this, 'bootstrappedClass', {
                    value: Module,
                    writable: false,
                    enumerable: true
                });
            }

            Object.defineProperty(this, 'bootstrappedInstance', {
                value: new Module(),
                writable: false,
                enumerable: true
            });

            return this;
        }
    }, {
        key: 'instanceOnly',
        get: function get() {
            return (/^[!A-Z]$/.test(this.ref.substr(0, 1))
            );
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
            return true === this.instanceOnly ? undefined : this.ref;
        }
    }, {
        key: 'instanceRef',
        get: function get() {
            return true === this.instanceOnly ? this.ref : instanceRef(this.ref);
        }
    }]);

    return ModuleWrapper;
}();

function assertDependencyCountMatch(resolvedDependencies, moduleWrapper) {
    if (resolvedDependencies.length !== moduleWrapper.numDependencies) {
        throw new Error(util.format('Dependency miscount: Expected %s, got %s', moduleWrapper.numDependencies, resolvedDependencies.length));
    }
}
//# sourceMappingURL=module-wrapper.js.map
