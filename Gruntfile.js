/* global module:false */
module.exports = function (grunt) {'use strict';

    require('load-grunt-tasks')(grunt);

    /**
     * Grunt Task Config
     */

    grunt.initConfig({

        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015'],
            },
            dist: {
                files: {
                    'dist/xublit-injector.js'    : 'src/xublit-injector.js',
                    'dist/module-loader.js'      : 'src/module-loader.js',
                    'dist/module-registrar.js'   : 'src/module-registrar.js',
                    'dist/module-wrapper.js'     : 'src/module-wrapper.js',
                },
            },
        },

        jshint: {
            all: ['src/**/*.js'],
            options: {
                eqnull: true,
                eqeqeq: true,
                multistr: true,
                validthis: true,
            },
        },

        watch: {
            files: ['test/**/*.js', 'src/**/*.js'],
            tasks: ['babel', 'karma:background:run'],
        },

        karma: {

            options: {
                configFile: 'karma.conf.js',
                frameworks: ['jasmine', 'requirejs', 'es6-shim'],
                browsers: ['PhantomJS'],
                singleRun: true,
                port: 8080,
                colors: true,
                autoWatch: false,
                autoWatchatchInterval: 0,
            },

            background: {
                background: true,
                singleRun: false,
                reporters: ['spec'],
            },

        },

    });


    /**
     * Grunt Tasks
     */

    grunt.registerTask(
        'default',
        ['babel']
    );

    grunt.registerTask(
        'dev',
        'Run dev server and watch for changes',
        ['babel', 'karma:background', 'watch']
    );

};