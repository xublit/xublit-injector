'use strict';

var path = require('path');
var srcDirname = path.join(path.dirname(require.main.filename), 'src');

jasmine.requireInjectorSrc = function requireInjectorSrc (s) {
    return require(path.join(srcDirname, s));
};