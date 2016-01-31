'use strict';

module.exports = function (karma) {

    karma.set({
        basePath: '',
        files: ['test/helpers/**/*.js', 'test/spec/**/*.js'],
        logLevel: karma.LOG_DEBUG,
        reporters: ['dots'],
    });

};