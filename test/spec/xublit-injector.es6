import path from 'path';
import util from 'util';
import EventEmitter from 'events';

import * as __ from '../constants';

import Injector from '../../build/src/xublit-injector';
import { includeModulesFrom as defaultModuleLoader } from '../../build/src/module-loader';

describe('Xublit Injector', () => {

    var injector;

    beforeEach(() => {

        injector = new Injector({
            rootDir: __.FAKE_ROOT_DIR,
        });

    });

    describe('constructor', () => {

        it('should throw an error if the "rootDir" option is not specified', () => {
            expect(() => {
                injector = new Injector();
            }).toThrowError('Missing "rootDir" option');
        });

        it('should set correct default properties when ', () => {
            expect(injector.moduleLoader).toBe(defaultModuleLoader)
            expect('missingDependencyHandler' in injector).toBe(true);
            expect(injector.missingDependencyHandler).toBe(undefined);
        });

    });

    describe('instance', () => {
        
        it('should be an instance of EventEmitter', () => {
            expect(injector instanceof EventEmitter).toBe(true);
        });

    });

});