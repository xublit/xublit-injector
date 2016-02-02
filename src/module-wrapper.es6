import * as util from 'util';

import InjectableClass from './injectable-class';
import InjectableInstance from './injectable-instance';

import { instanceRef } from './util';

export default class ModuleWrapper {

    constructor (xublitModule) {

        this.defineEnumerable('ref', xublitModule.ref)
            .defineEnumerable('dependencyRefs', xublitModule.inject.slice(0))
            .defineEnumerable('bootstrapFn', xublitModule.bootstrap);

    }

    get refTypeIdentifier () {
        return this.ref.substr(0, 1);
    }

    get isAbstractClass () {
        return /^Abstract[A-Z]/.test(this.ref);
    }

    get isOnlyInjectableAsInstance () {
        return true === this.isInjectableAsInstance &&
            false === this.isInjectableAsClass;
    }

    get isInjectableAsInstance () {
        return false === this.isAbstractClass &&
            '!' !== this.refTypeIdentifier;
    }

    get isInjectableAsClass () {
        return this.isAbstractClass ||
            /^[A-Z]/.test(this.refTypeIdentifier);
    }

    get bootstrapped () {
        return Boolean('_bootstrapped' in this && this._bootstrapped);
    }

    get numDependencies () {
        return this.dependencyRefs.length;
    }

    get classRef () {

        if (false === this.isInjectableAsClass) {
            return undefined;
        }

        return this.ref;

    }

    get instanceRef () {

        if (false === this.isInjectableAsInstance) {
            return undefined;
        }

        if (true === this.isOnlyInjectableAsInstance) {
            return this.ref;
        }

        if (true === this.isInjectableAsClass) {
            return instanceRef(this.ref);
        }

    }

    get isBootstrapped () {
        return undefined !== this.bootstrapReturnValue;
    }

    defineEnumerable (prop, value) {

        Object.defineProperty(this, prop, {
            value: value,
            enumerable: true,
        });

        return this;

    }

    injectableFor (ref) {
        
        switch (ref) {
            case this.instanceRef:
                return this.bootstrappedInstance;
            case this.classRef:
                return this.bootstrappedClass;
        }

    }

    bootstrap (resolvedDependencies) {

        if (this.isBootstrapped) {
            return this;
        }

        assertValidDependencies(resolvedDependencies, this);

        this.defineEnumerable(
            'bootstrapReturnValue',
            bootstrap(this.bootstrapFn, resolvedDependencies)
        );

        parseBootstrapReturnValueFor(this);

        return this;

    }

}

function assertValidDependencies (resolvedDependencies, moduleWrapper) {

    if (!Array.isArray(resolvedDependencies)) {
        throw new TypeError('Resolved dependencies must be an Array');
    }

    if (resolvedDependencies.length !== moduleWrapper.numDependencies) {
        throw new Error(util.format(
            'resolvedDependencies mismatch: Expected %s, got %s',
            moduleWrapper.numDependencies,
            resolvedDependencies.length
        ));
    }

}

function bootstrap (bootstrapFn, resolvedDependencies) {

    try {
        return bootstrapFn(...resolvedDependencies);
    }
    catch (error) {
        // Bootstrap failed while executing module's bootstrap function
        throw new Error('');
    }

}

function parseBootstrapReturnValueFor (moduleWrapper) {

    var ref = moduleWrapper.ref;
    var Module = moduleWrapper.bootstrapReturnValue;

    if (true === moduleWrapper.isInjectableAsClass) {
        moduleWrapper.defineEnumerable(
            'injectableClass', new InjectableClass(moduleWrapper)
        );
    }

    if (true === moduleWrapper.isInjectableAsInstance) {
        moduleWrapper.defineEnumerable(
            'injectableInstance', new InjectableInstance(moduleWrapper)
        );
    }

}