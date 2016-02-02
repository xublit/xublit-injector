import EventEmitter from 'events';

import * as path from 'path';
import * as util from 'util';

import Injector from '../../src/xublit-injector';

import { FAKE_BASE_DIR } from '../constants';
import { loadModulesIn } from '../../src/module-loader';

describe('The Xublit Injector', () => {

    var injector;

    beforeEach(() => {

        injector = new Injector({
            baseDir: FAKE_BASE_DIR,
            includeDirs: [
                path.join(FAKE_BASE_DIR, 'fake-node_modules', 'xublit-*'),
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

            expect(injector.moduleLoader).toBe(loadModulesIn);

            expect('missingDependencyHandler' in injector).toBe(true);
            expect(injector.missingDependencyHandler).toEqual(jasmine.any(
                Function
            ));

            expect(injector.includeDirs).toEqual(jasmine.arrayContaining([
                path.join(FAKE_BASE_DIR, 'node_modules', 'xublit*'),
                path.join(FAKE_BASE_DIR, 'src'),
            ]));

            expect(injector.moduleWrapperRefs).toEqual(jasmine.any(Map));
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

    describe('loadModules()', () => {

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

            injector.loadModules();

            expect(spies.moduleLoader).toHaveBeenCalledWith(jasmine.arrayContaining(
                fakeIncludeDirs
            ));

        });

        it('should load the Xublit modules found in includeDirs', () => {
            injector.loadModules();
            expect(injector.loadedModules.length).toBe(7);
        });

    });

    describe('wrapLoadedModules()', () => {

        beforeEach(() => {
            injector.loadModules().wrapLoadedModules();
        });

        it('should wrap all the modules in this.loadedModules', () => {
            expect(injector.wrappedModules.length)
                .toBe(injector.loadedModules.length);
        });

        var refs = [
            '$aCoreModule',
            'AbstractFakeModule',
            'singletonModule',
            'SomeFakeModule',
            'someFakeModule',
            'aDeepModule',
            'AnotherModule',
            'anotherModule',
            'FakeModule',
            'fakeModule',
        ];

        refs.forEach((ref) => {

            var message = util.format(
                'should set the value for "%s" on this.moduleWrapperRefs', ref
            );

            it(message, () => {
                expect(injector.moduleWrapperRefs.has(ref)).toBe(true);
                expect(injector.moduleWrapperRefs.get(ref)).not.toBeUndefined();
            });

        });

    });

    describe('bootstrap()', () => {

        beforeEach(() => {
            injector.bootstrap();
        })

        it('should bootstrap the correct number of Xublit modules', () => {
            expect(injector.wrappedModules.length).toBe(7);
        });

        describe('test modules', () => {

            var $aCoreModule;
            var AnotherModule;
            var SomeFakeModule;
            var someFakeModule;
            var singletonModule;
            var AbstractFakeModule;

            beforeEach(() => {

                $aCoreModule = injector.injectable('$aCoreModule');
                AnotherModule = injector.injectable('AnotherModule');
                SomeFakeModule = injector.injectable('SomeFakeModule');
                someFakeModule = injector.injectable('someFakeModule');
                singletonModule = injector.injectable('singletonModule');
                AbstractFakeModule = injector.injectable(
                    'AbstractFakeModule'
                );

            });

            describe('someFakeModule', () => {

                it('should be an instanceof SomeFakeModule', () => {
                    expect(someFakeModule instanceof SomeFakeModule).toBe(true);
                });

                it('should be an instanceof AbstractFakeModule', () => {
                    expect(someFakeModule instanceof AbstractFakeModule).toBe(true);
                });

                it('should have "foo" as value for property "someVar"', () => {
                    expect(someFakeModule.someVar).toBe('foo');
                });

                it('should have "bar" as value for property "anotherVar"', () => {
                    expect(someFakeModule.anotherVar).toBe('bar');
                });

            });

            describe('singletonModule', () => {

                var moduleWrapper;

                beforeEach(() => {

                    moduleWrapper = injector.moduleWrapperRefs
                        .get('singletonModule');


                });

                it('should not be available as a class', () => {
                    expect(moduleWrapper.injectableClass).toBeUndefined();
                });

            });

            describe('$aCoreModule', () => {

                var moduleWrapper;

                beforeEach(() => {

                    moduleWrapper = injector.moduleWrapperRefs
                        .get('$aCoreModule');

                });

                it('should not be available as a class', () => {
                    expect(moduleWrapper.injectableClass).toBeUndefined();
                });

                it('should have a property "AnotherModule" which is a reference to the injectable for "AnotherModule"', () => {
                    expect($aCoreModule.AnotherModule).toBe(AnotherModule);
                });

                it('should have a property "SomeFakeModule" which is a reference to the injectable for "SomeFakeModule"', () => {
                    expect($aCoreModule.SomeFakeModule).toBe(SomeFakeModule);
                });

                it('should have a property "someFakeModule" which is a reference to the injectable for "someFakeModule"', () => {
                    expect($aCoreModule.someFakeModule).toBe(someFakeModule);
                });

                it('should have a property "singletonModule" which is a reference to the injectable for "singletonModule"', () => {
                    expect($aCoreModule.singletonModule).toBe(singletonModule);
                });

                it('should have a property "injector" which is a reference to the injector', () => {
                    expect($aCoreModule.injector).toBe(injector);
                });

            });

        });

    });

});