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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModuleBootstrapScope = function ModuleBootstrapScope(scopeVars) {
    _classCallCheck(this, ModuleBootstrapScope);

    if ('$options' in scopeVars) {
        this.$options = function () {
            scopeVars.$options();
        };
    }

    Object.keys(scopeVars).forEach(function (key) {

        var value = scopeVars[key];

        if ('$options' === key) {
            value = function value() {};
        }
    });

    Object.assign(this, scopeVars);
    Object.freeze(this);
};

exports.default = ModuleBootstrapScope;
//# sourceMappingURL=module-bootstrap-scope.js.map
