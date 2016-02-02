/* global module:false */
module.exports = function (grunt) {'use strict';

    var path = require('path');

    var SpecReporter = require('jasmine-spec-reporter');
    var Jasmine = require('jasmine');

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

        var jasmine = new Jasmine();

        jasmine.loadConfigFile([__dirname, 'jasmine.json'].join(path.sep));

        jasmine.configureDefaultReporter({ print: function () {} });
        jasmine.addReporter(new SpecReporter());

        jasmine.execute();

    }

};