/* global module:false */
module.exports = function (grunt) {'use strict';

    var path = require('path');

    require('load-grunt-tasks')(grunt);

    /**
     * Grunt Task Config
     */

    grunt.initConfig({

        buildDir: 'build',

        clean: [
            '<%= buildDir %>',
        ],

        babel: {
            options: {
                sourceMap: true,
                presets: [
                    'es2015',
                ],
            },
            build: {
                files: [{
                    expand: true,
                    src: [
                        'src/**/*.es6',
                    ],
                    dest: '<%= buildDir %>/',
                    ext: '.js',
                }],
            },
        },

        jshint: {
            all: [
                'src/**/*.js',
            ],
            options: {
                eqnull: true,
                eqeqeq: true,
                multistr: true,
                validthis: true,
            },
        },

        watch: {
            dev: {
                options: {
                    spawn: true
                },
                files: [
                    'src/**/*.es6',
                    'test/**/*.es6',
                ],
                tasks: [
                    'build',
                    'karma:unit',
                ],
            },
        },

        karma: {

            options: {

                autoWatch: false,
                autoWatchatchInterval: 0,
                basePath: '',
                colors: true,
                port: 8878,
                singleRun: true,
                logLevel: 'INFO',

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
            },

            unit: {
                reporters: [
                    'spec',
                ],
            },

            debug: {
                logLevel: 'DEBUG',
            },

        },

    });

    /**
     * Grunt Tasks
     */

    grunt.registerTask(
        'default',
        ['build']
    );

    grunt.registerTask(
        'build',
        ['clean', 'babel']
    );

    grunt.registerTask(
        'unit',
        'Run dev server and watch for changes',
        ['build', 'karma:unit']
    );

    grunt.registerTask(
        'dev',
        'Run dev server and watch for changes',
        ['watch:dev']
    );

};