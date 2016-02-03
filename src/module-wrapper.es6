import * as util from 'util';

import InjectableClass from './injectable-class';
import InjectableInstance from './injectable-instance';

import { instanceRef } from './util';

export default class ModuleWrapper {

    constructor (xublitModule) {

        if (!xublitModule.ref) {
            throw new Error('Invalid value for "ref" in xublitModule');
        }

        this.defineEnumerable('ref', xublitModule.ref)
            .defineEnumerable('bootstrapFn', xublitModule.bootstrap)
            .defineEnumerable('dependencyRefs', xublitModule.inject.slice(0));

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
            /^[A-Z]$/.test(this.refTypeIdentifier);
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

    setBootstrapScope (bootstrapScope) {
        this.defineEnumerable('bootstrapScope', bootstrapScope);
        return this;
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
                return this.injectableInstance;
            case this.classRef:
                return this.injectableClass;
        }

    }

    bootstrap (resolvedDependencies) {

        if (this.isBootstrapped) {
            return this;
        }

        assertValidDependencies(resolvedDependencies, this);

        this.defineEnumerable(
            'bootstrapReturnValue',
            bootstrap(this, this.bootstrapFn, resolvedDependencies)
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

function bootstrap (moduleWrapper, bootstrapFn, resolvedDependencies) {

    var moduleRef = moduleWrapper.moduleRef;
    var bootstrapScope = moduleWrapper.bootstrapScope;

    try {
        return bootstrapFn.call(bootstrapScope, ...resolvedDependencies);
    }
    catch (error) {
        // Bootstrap failed while executing module's bootstrap function
        let originalErrorMsg = error.message;
        throw new Error(util.format(
            'Failed to bootstrap module %s: %s', moduleRef, originalErrorMsg
        ));
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