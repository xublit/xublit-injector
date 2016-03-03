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
exports.missingDependencyHandler = missingDependencyHandler;

var _util = require('util');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function missingDependencyHandler(moduleRef, dependencyRef, index) {

    throw new Error(util.format('Missing dependency "%s" for "%s" module init.  Ref index: %s', dependencyRef, moduleRef, index));
}
//# sourceMappingURL=missing-dependency-handler.js.map
