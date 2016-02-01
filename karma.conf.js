'use strict';

module.exports = function (karma) {

    karma.set({

                basePath: '',
                colors: true,
                port: 8878,
                logLevel: 'DEBUG',

                files: [
                    'test/spec/**/*.es6',
                ],
                preprocessors: {
                    'src/**/*.es6': [
                        'browserify',
                    ],
                    'test/spec/**/*.es6': [
                        'browserify',
                    ],
                },
                
                browserify: {
                    debug: true,
                    sourceType: 'module',
                    transform: [
                        'babelify',
                        'brfs',
                    ],
                    extensions: [
                        '.es6',
                    ],
                },
                
                browsers: [
                    'PhantomJS',
                ],

                frameworks: [
                    'browserify',
                    'source-map-support',
                    'jasmine',
                ],
                
                reporters: [
                    'dots',
                ],
    });

};