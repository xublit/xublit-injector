/**
 * Injector for Xublit
 * @version v1.0.0-rc.1-dev-2016-02-03
 * @link https://github.com/xublit/xublit-injector
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _injectable = require('./injectable');

var _injectable2 = _interopRequireDefault(_injectable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InjectableClass = function (_Injectable) {
    _inherits(InjectableClass, _Injectable);

    function InjectableClass(moduleWrapper) {
        _classCallCheck(this, InjectableClass);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(InjectableClass).call(this, moduleWrapper));

        Object.defineProperty(_this, 'injectable', {
            value: moduleWrapper.bootstrapReturnValue
        });

        return _this;
    }

    return InjectableClass;
}(_injectable2.default);

exports.default = InjectableClass;
//# sourceMappingURL=injectable-class.js.map
