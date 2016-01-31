const path = require('path');
const util = require('util');
const EventEmitter = require('events');

import { Injector } from './xublit-injector';

const APP_ROOT_DIR = path.dirname(require.main.filename);
const FAKE_INJECTOR_MODULES_DIR = path.join(
    APP_ROOT_DIR, 'test', 'fakes', 'injectorModules'
);

describe('Xublit Injector', function () {

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