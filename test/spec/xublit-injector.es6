const path = require('path');
const util = require('util');
const EventEmitter = require('events');

import { Injector } from '../../build/src/xublit-injector';

const FAKE_ROOT_DIR = path.dirname('../fakeRoot');
const FAKE_INJECTOR_MODULES_DIR = path.join(
    'test', 'fakes', 'injectorModules'
); 

describe('Xublit Injector', function () {

    var injector;

    beforeEach(function () {

        injector = new Injector({
            coreModuleName: '$someAppCore',
            rootDir: FAKE_ROOT_DIR,
            includeDirs: [FAKE_INJECTOR_MODULES_DIR],
        });

    });

    describe('constructor', function () {

        it('should throw an error if the rootDir option is not specified', function () {
            expect(function () {
                injector = new Injector({
                    coreModuleName: '$someAppCore',
                    // rootDir: FAKE_ROOT_DIR,
                    includeDirs: [FAKE_INJECTOR_MODULES_DIR],
                });
            }).toThrowError('Missing "rootDir" option');
        });

    });

    describe('instance', function () {
        
        it('should be an instance of EventEmitter', function () {
            expect(injector instanceof EventEmitter).toBe(true);
        });

    });


});