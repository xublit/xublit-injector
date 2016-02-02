/* global module:false */
module.exports = function (grunt) {'use strict';

    var path = require('path');
    var Jasmine = require('jasmine');
    var JasmineSpecReporter = require('jasmine-spec-reporter');

    var jasmineSpecReporter = new JasmineSpecReporter({
        displayStacktrace: 'summary',
    });

    require('load-grunt-tasks')(grunt);


    /**
     * Grunt Task Config
     */

    grunt.initConfig({

        buildDir: 'build',
        distDir: 'dist',

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
                        'test/**/*.es6',
                    ],
                    dest: '<%= buildDir %>/',
                    ext: '.js',
                }],
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
                    'test',
                ],
            },
        },

        test: {
            options: {
                configFile: 'jasmine.json',
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
        'Perform a clean build',
        ['clean', 'babel']
    );

    grunt.registerTask(
        'unit',
        'Run dev server and watch for changes',
        ['build', 'test']
    );

    grunt.registerTask(
        'dev',
        'Run dev server and watch for changes',
        ['watch:dev']
    );

    grunt.registerTask(
        'test',
        runJasmineTests
    );


    /**
     * Grunt Task Functions
     */

    function runJasmineTests () {

        var options = this.options();

        var done = this.async();
        var jasmine = new Jasmine();

        jasmine.loadConfigFile(path.resolve(options.configFile));

        jasmine.configureDefaultReporter({ print: function () {} });
        jasmine.addReporter(jasmineSpecReporter);

        jasmine.onComplete(function(passed) {
            done(passed);
        });

        jasmine.execute();

    }

};