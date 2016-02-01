import EventEmitter from 'events';

import * as path from 'path';
import * as util from 'util';

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

            expect(injector.moduleLoader).toBe(defaultModuleLoader);

            expect('missingDependencyHandler' in injector).toBe(true);
            expect(injector.missingDependencyHandler).toBe(undefined);

            expect(injector.includeDirs).toEqual(jasmine.arrayContaining([
                path.join(__.FAKE_ROOT_DIR, 'node_modules', 'xublit*'),
                path.join(__.FAKE_ROOT_DIR, 'src'),
            ]));

        });

    });

    describe('instance', () => {
        
        it('should be an instance of EventEmitter', () => {
            expect(injector instanceof EventEmitter).toBe(true);
        });

    });

});