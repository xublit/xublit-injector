import ModuleWrapper from '../../src/module-wrapper';
import InjectableClass from '../../src/injectable-class';
import InjectableInstance from '../../src/injectable-instance';

describe('The ModuleWrapper', () => {

    var fakeDependencyOne;
    var FakeDependencyTwo;

    var fakeModule;
    var moduleWrapper;
    var fakeModuleDepRefs;
    var fakeModuleBootstrapReturnValue;

    beforeEach(() => {

        fakeModuleDepRefs = ['fakeDependencyOne', 'FakeDependencyTwo'];

        fakeDependencyOne = new (class FakeDependencyOne {
            constructor () { }
        })();

        FakeDependencyTwo = class FakeDependencyTwo {
            constructor () { }
        };

        fakeModuleBootstrapReturnValue = class FakeModule {
            constructor () {

            }
        };

        fakeModule = {
            ref: 'FakeModule',
            inject: fakeModuleDepRefs,
            bootstrap: function () { },
        };

        spyOn(fakeModule, 'bootstrap').and.returnValue(
            fakeModuleBootstrapReturnValue
        );

        moduleWrapper = new ModuleWrapper(fakeModule, fakeModule.ref);

    });

    describe('constructor(xublitModule, ref)', () => {

        it('should set this.ref to the value for the modules export var "ref"', () => {
            expect(moduleWrapper.ref).toBe('FakeModule');
        });

        it('should set this.dependencyRefs to a copy of the value for the modules export var "inject"', () => {
            
            expect(moduleWrapper.dependencyRefs)
                .toEqual(jasmine.arrayContaining(fakeModuleDepRefs));

            expect(moduleWrapper.dependencyRefs.length)
                .toBe(fakeModuleDepRefs.length);

            expect(moduleWrapper.dependencyRefs)
                .not.toBe(fakeModuleDepRefs);

        });

        it('should set this.bootstrapFn to the value for the modules export var "bootstrap"', () => {
            expect(moduleWrapper.bootstrapFn).toBe(fakeModule.bootstrap);
        });

    });

    describe('refTypeIdentifier', () => {

        it('should be the first character of the module\'s "ref"', () => {
            expect(moduleWrapper.refTypeIdentifier).toBe('F');
        });

    });

    describe('isAbstractClass', () => {

        it('should be false if the module\'s "ref" does not begin with "Abstract"', () => {
            expect(moduleWrapper.isAbstractClass).toBe(false);
        });

        it('should be true if the module\'s "ref" begins with "Abstract"', () => {
            
            moduleWrapper = new ModuleWrapper({
                ref: 'AbstractFakeModule',
                inject: [],
                bootstrap: function () { },
            }, 'AbstractFakeModule');

            expect(moduleWrapper.isAbstractClass).toBe(true);

        });

    });

    describe('isInjectableAsInstance', () => {

        it('should be true if the module is not an abstract class, and does not have a refTypeIdentifier of "!"', () => {
            expect(moduleWrapper.isInjectableAsInstance).toBe(true);
        });

        it('should be false if this.isAbstractClass', () => {
            
            moduleWrapper = new ModuleWrapper({
                ref: 'AbstractFakeModule',
                inject: [],
                bootstrap: function () { },
            }, 'AbstractFakeModule');

            expect(moduleWrapper.isInjectableAsInstance).toBe(false);

        });

        it('should be false if this.refTypeidentifier === "!"', () => {
            
            moduleWrapper = new ModuleWrapper({
                ref: '!singletonOnlyFakeModule',
                inject: [],
                bootstrap: function () { },
            }, '!singletonOnlyFakeModule');

            expect(moduleWrapper.isInjectableAsInstance).toBe(false);

        });

    });

    describe('isInjectableAsClass', () => {

        it('should be true if this.isAbstractClass', () => {
            
            moduleWrapper = new ModuleWrapper({
                ref: 'AbstractFakeModule',
                inject: [],
                bootstrap: function () { },
            }, 'AbstractFakeModule');

            expect(moduleWrapper.isInjectableAsClass).toBe(true);

        });

        it('should be true if this.refTypeidentifier is an upper-case letter (A-Z)', () => {
            expect(moduleWrapper.isInjectableAsClass).toBe(true);
        });

        it('should be false if this.refTypeIdentifier is not an upper-case letter (A-Z)', () => {
            
            moduleWrapper = new ModuleWrapper({
                ref: 'singletonFakeModule',
                inject: [],
                bootstrap: function () { },
            }, 'singletonFakeModule');

            expect(moduleWrapper.isInjectableAsClass).toBe(false);

        });

    });

    describe('numDependencies', () => {

        it('should be the number of dependency refs for this module', () => {
            expect(moduleWrapper.numDependencies).toBe(2);
        });

    });

    describe('classRef', () => {

        it('should be "FakeModule" if the module ref is "FakeModule"', () => {
            expect(moduleWrapper.classRef).toBe('FakeModule');
        });

        it('should be undefined if the module ref is "singletonFakeModule"', () => {
            moduleWrapper = new ModuleWrapper({
                ref: 'singletonFakeModule',
                inject: [],
                bootstrap: function () { },
            }, 'singletonFakeModule');
            expect(moduleWrapper.classRef).toBeUndefined();
        });

        it('should be undefined if the module ref is prefixed with "$"', () => {
            moduleWrapper = new ModuleWrapper({
                ref: '$singletonFakeModule',
                inject: [],
                bootstrap: function () { },
            }, 'singletonFakeModule');
            expect(moduleWrapper.classRef).toBeUndefined();
        });

    });

    describe('instanceRef', () => {

        it('should be "fakeModule" if the module ref is "FakeModule"', () => {
            expect(moduleWrapper.instanceRef).toBe('fakeModule');
        });

        it('should be undefined if the module ref is prefixed with "!"', () => {
            moduleWrapper = new ModuleWrapper({
                ref: '!FakeModule',
                inject: [],
                bootstrap: function () { },
            }, '!FakeModule');
            expect(moduleWrapper.instanceRef).toBeUndefined();
        });

        it('should be undefined if the module ref is prefixed with "Abstract"', () => {
            moduleWrapper = new ModuleWrapper({
                ref: 'AbstractFakeModule',
                inject: [],
                bootstrap: function () { },
            }, 'AbstractFakeModule');
            expect(moduleWrapper.instanceRef).toBeUndefined();
        });

    });

    describe('isBootstrapped', () => {

        it('should be false if the module is not bootstrapped', () => {
            expect(moduleWrapper.isBootstrapped).toBe(false);
        });

        it('should be true if the module is bootstrapped', () => {
            
            moduleWrapper = new ModuleWrapper({
                ref: 'FakeModule',
                inject: [],
                bootstrap: function () {
                    return class FakeModule {
                        constructor () {

                        }
                    };
                },
            }, 'FakeModule');

            moduleWrapper.bootstrap([]);

            expect(moduleWrapper.isBootstrapped).toBe(true);

        });

    });

    describe('defineEnumerable(prop, value)', () => {

        it('should define properties on this that are enumerable only', () => {
            
            moduleWrapper.defineEnumerable('foo', 'bar');
            
            expect(Object.getOwnPropertyDescriptor(moduleWrapper, 'foo'))
                .toEqual(jasmine.objectContaining({
                    value: 'bar',
                    writable: false,
                    enumerable: true,
                    configurable: false,
                }));

        });

    });

    describe('injectableFor(ref)', () => {

        it('should return this.injectableInstance if ref === this.instanceRef', () => {
            moduleWrapper.injectableInstance = 'foo';
            expect(moduleWrapper.injectableFor(moduleWrapper.instanceRef))
                .toBe('foo');
        });

        it('should return this.injectableClass if ref === this.classRef', () => {
            moduleWrapper.injectableClass = 'foo';
            expect(moduleWrapper.injectableFor(moduleWrapper.classRef))
                .toBe('foo');
        });

    });

    describe('bootstrap(resolvedDependencies)', () => {

        it('should throw an error if resolvedDependencies is not an Array', () => {
            expect(function () {
                moduleWrapper.bootstrap('foo');
            }).toThrowError('Resolved dependencies must be an Array');
        });

        it('should throw an error if the number of resolvedDependencies !== this.numDependencies', () => {
            expect(function () {
                moduleWrapper.bootstrap(['foo', 'bar', 'baz', 'quux']);
            }).toThrowError('resolvedDependencies mismatch: Expected 2, got 4');
        });

        describe('when the resolvedDependencies are valid', () => {

            beforeEach(() => {
                moduleWrapper.bootstrap([fakeDependencyOne, FakeDependencyTwo]);
            });

            it('should call the modules bootstrap function using resolvedDependencies as the arguments', () => {
                expect(fakeModule.bootstrap)
                    .toHaveBeenCalledWith(fakeDependencyOne, FakeDependencyTwo);
            });

            it('should set this.bootstrapReturnValue to the value returned by the modules bootstrap function', () => {
                expect(moduleWrapper.bootstrapReturnValue)
                    .toBe(fakeModuleBootstrapReturnValue);
            });

            it('should set this.injectableClass to an instance of InjectableClass', () => {
                expect(moduleWrapper.injectableClass)
                    .toEqual(jasmine.any(InjectableClass));
            });

            it('should set this.injectableInstance to an instance of InjectableInstance', () => {
                expect(moduleWrapper.injectableInstance)
                    .toEqual(jasmine.any(InjectableInstance));
            });

        });

    });

});