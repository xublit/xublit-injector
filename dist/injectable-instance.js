/**
 * Injector for Xublit
 * @version v1.0.0-rc.3
 * @link https://github.com/xublit/xublit-injector
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _injectable = require('./injectable');

var _injectable2 = _interopRequireDefault(_injectable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InjectableInstance = function (_Injectable) {
    _inherits(InjectableInstance, _Injectable);

    function InjectableInstance(moduleWrapper) {
        _classCallCheck(this, InjectableInstance);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(InjectableInstance).call(this, moduleWrapper));

        Object.defineProperty(_this, 'injectable', {
            value: new moduleWrapper.bootstrapReturnValue()
        });

        return _this;
    }

    _createClass(InjectableInstance, [{
        key: 'ref',
        get: function get() {
            return this.moduleWrapper.instanceRef;
        }
    }, {
        key: 'injectable',
        get: function get() {
            return this.moduleWrapper;
        }
    }]);

    return InjectableInstance;
}(_injectable2.default);

exports.default = InjectableInstance;
//# sourceMappingURL=injectable-instance.js.map
