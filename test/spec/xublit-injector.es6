import EventEmitter from 'events';

import * as path from 'path';
import * as util from 'util';

import Injector from '../../build/src/xublit-injector';

import { FAKE_BASE_DIR } from '../constants';
import defaultModuleLoader from '../../build/src/module-loader';

describe('Xublit Injector', () => {

    var injector;

    beforeEach(() => {

        injector = new Injector({
            baseDir: FAKE_BASE_DIR,
            includeDirs: [
                path.join(FAKE_BASE_DIR, 'fake-node_modules', 'xublit-fake-*'),
                path.join(FAKE_BASE_DIR, 'fake-src'),
            ],
        });

    });

    describe('constructor(opts)', () => {

        it('should throw an error if the "baseDir" option is not specified', () => {
            expect(() => {
                injector = new Injector();
            }).toThrowError('Missing "baseDir" option');
        });

        it('should use correct default options', () => {

            injector = new Injector({
                baseDir: FAKE_BASE_DIR,
            });

            expect(injector.moduleLoader).toBe(defaultModuleLoader);

            expect('missingDependencyHandler' in injector).toBe(true);
            expect(injector.missingDependencyHandler).toEqual(jasmine.any(
                Function
            ));

            expect(injector.includeDirs).toEqual(jasmine.arrayContaining([
                path.join(FAKE_BASE_DIR, 'node_modules', 'xublit*'),
                path.join(FAKE_BASE_DIR, 'src'),
            ]));

            expect(injector.modulesByDependencyRef).toEqual(jasmine.any(Map));
            expect(injector.loadedModules).toEqual(jasmine.any(Array));

        });

        it('should add properties specified in "opts"', () => {
            
            var fakeDependencyHandler = function () { };
            var fakeModuleLoader = function () { };

            injector = new Injector({
                baseDir: FAKE_BASE_DIR,
                coreModuleName: '$myInjector',
                missingDependencyHandler: fakeDependencyHandler,
                moduleLoader: fakeModuleLoader,
                includeDirs: [
                    path.join(FAKE_BASE_DIR, 'xublit_modules'),
                ],
            });

            expect(injector.baseDir).toBe(FAKE_BASE_DIR);
            expect(injector.coreModuleName).toBe('$myInjector');
            expect(injector.missingDependencyHandler).toBe(fakeDependencyHandler);
            expect(injector.moduleLoader).toBe(fakeModuleLoader);

            expect(injector.includeDirs.length).toBe(1);
            expect(injector.includeDirs).toEqual(jasmine.arrayContaining([
                path.join(FAKE_BASE_DIR, 'xublit_modules'),
            ]));

        });

        it('should ignore properties specified in "opts" where no matching key exists in "defaults"', () => {
            
            injector = new Injector({
                baseDir: FAKE_BASE_DIR,
                foobarsCustomValue: 'quux',
            });

            expect(Object.keys(injector)).not.toEqual(jasmine.arrayContaining([
                'foobarsCustomValue'
            ]));

        });

        it('should throw an error if invalid value provided for "includeDirs" in "opts"', () => {
            
            expect(() => {
                injector = new Injector({
                    baseDir: FAKE_BASE_DIR,
                    includeDirs: 'meow',
                });
            }).toThrowError('Invalid value for property "includeDirs" - expected Array');

            expect(() => {
                injector = new Injector({
                    baseDir: FAKE_BASE_DIR,
                    includeDirs: [
                        'some/relative/file/path',
                    ],
                });
            }).toThrowError('Invalid include path "some/relative/file/path" found in "includeDirname" - must be an absolute path (eg: starting with a / or C:\\)');

        });

        it('should extend EventEmitter', () => {
            expect(injector instanceof EventEmitter).toBe(true);
        });

    });

    describe('bootstrap()', () => {

        it('should use the custom "moduleLoader" if specified in constructor "opts"', () => {

            var spies = {
                moduleLoader: function () { },
            };

            spyOn(spies, 'moduleLoader').and.returnValue([]);

            var fakeIncludeDirs = [
                path.join(FAKE_BASE_DIR, 'xublit_modules')
            ];

            injector = new Injector({
                baseDir: FAKE_BASE_DIR,
                moduleLoader: spies.moduleLoader,
                includeDirs: fakeIncludeDirs,
            });

            injector.bootstrap();

            expect(spies.moduleLoader).toHaveBeenCalledWith(jasmine.arrayContaining(
                fakeIncludeDirs
            ));

        });

    });

});