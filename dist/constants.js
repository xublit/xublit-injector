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
/* Error messages */
var ERROR_MESSAGE_NONAME_DEPENDENCY = exports.ERROR_MESSAGE_NONAME_DEPENDENCY = 'Invalid (empty) dependency reference at index %s';
var ERROR_MESSAGE_INCL_DIRS_NOT_ARRAY = exports.ERROR_MESSAGE_INCL_DIRS_NOT_ARRAY = 'Invalid value for property "includeDirs" - expected Array';
var ERROR_MESSAGE_UNDEFINED_DEPENDENCY = exports.ERROR_MESSAGE_UNDEFINED_DEPENDENCY = 'Invalid (undefined) value returned while bootstrapping "%s"';
var ERROR_MESSAGE_RELATIVE_INCL_DIR = exports.ERROR_MESSAGE_RELATIVE_INCL_DIR = 'Invalid include path "%s" found in "includeDirname" - must be an absolute path (eg: starting with a / or C:\\)';
var ERROR_MESSAGE_INVALID_FUNCTION_FOR = exports.ERROR_MESSAGE_INVALID_FUNCTION_FOR = 'Invalid value for property "%s" - expected function';

/* Error types */
var ERR_DEP_RESOLUTION_FAILED = exports.ERR_DEP_RESOLUTION_FAILED = 'ERR_DEP_RESOLUTION_FAILED';

/* Default settings */
var DEFAULT_CORE_MODULE_NAME = exports.DEFAULT_CORE_MODULE_NAME = '$app';
//# sourceMappingURL=constants.js.map
