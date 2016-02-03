/**
 * Injector for Xublit
 * @version v1.0.0-rc.1
 * @link https://github.com/xublit/xublit-injector
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Injectable = function () {
    function Injectable(moduleWrapper) {
        _classCallCheck(this, Injectable);

        this._moduleWrapper = moduleWrapper;
    }

    _createClass(Injectable, [{
        key: "moduleWrapper",
        get: function get() {
            return this._moduleWrapper;
        }
    }, {
        key: "ref",
        get: function get() {
            return this.moduleWrapper.ref;
        }
    }]);

    return Injectable;
}();

exports.default = Injectable;
//# sourceMappingURL=injectable.js.map
