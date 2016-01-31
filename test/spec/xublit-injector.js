'use strict';

var path = require('path');
var util = require('util');
var EventEmitter = require('events');

var Injector = jasmine.requireInjectorSrc('xublit-injector.js');

var APP_ROOT_DIR = path.dirname(require.main.filename);
var FAKE_INJECTOR_MODULES_DIR = path.join(
    APP_ROOT_DIR, 'test', 'fakes', 'injectorModules'
);

describe('Xublit injector', function () {

    var injector;

    beforeEach(function () {

        injector = new Injector({
            coreModuleName: '$someAppCore',
            includeDirs: [FAKE_INJECTOR_MODULES_DIR],
        });

    });

    describe('instance', function () {
        
        it('should be an instance of EventEmitter', function () {
            expect(injector instanceof EventEmitter).toBe(true);
        });

    });


});