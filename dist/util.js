/**
 * Injector for Xublit
 * @version v1.0.0-rc.1-dev-2016-02-03
 * @link https://github.com/xublit/xublit-injector
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.instanceRef = instanceRef;
function instanceRef(str) {
    return str.substr(0, 1).toLowerCase() + str.substr(1);
}
//# sourceMappingURL=util.js.map
