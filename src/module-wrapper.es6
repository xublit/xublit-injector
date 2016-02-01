import { instanceRef } from './util';

export class ModuleWrapper {

    constructor (xublitModule) {

        Object.defineProperty(this, 'ref', {
            value: xublitModule.ref,
            writable: false,
            enumerable: true,
        });

        Object.defineProperties(this, {

            ref: {
                value: xublitModule.ref,
                writable: false,
                enumerable: true,
            },

            dependencyRefs: {
                value: xublitModule.inject.slice(0),
                writable: false,
                enumerable: true,
            },

            bootstrapFn: {
                value: xublitModule.bootstrap,
                writable: false,
                enumerable: true,
            },

            resolvedDependencies: {
                value: [],
                writable: false,
                enumerable: true,
            },

        });

    }

    get instanceOnly () {
        return /^[!A-Z]$/.test(this.ref.substr(0, 1));
    }

    get bootstrapped () {
        return Boolean('_bootstrapped' in this && this._bootstrapped);
    }

    get numDependencies () {
        return this.dependencyRefs.length;
    }

    get classRef () {
        return true === this.instanceOnly ? undefined : this.ref;
    }

    get instanceRef () {
        return true === this.instanceOnly ? this.ref : instanceRef(this.ref);
    }

    isBootstrapped () {
        return true === this.bootstrapped;
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

        if (true === this.bootstrapped) {
            return this;
        }

        if (!Array.isArray(resolvedDependencies)) {
            throw new TypeError('Resolved dependencies must be an Array');
        }

        assertDependencyCountMatch(this, resolvedDependencies);

        try {
            var Module = this.bootstrapFn(...resolvedDependencies);
        }
        catch (error) {
            // Bootstrap failed while executing module's bootstrap function
        }

        Object.defineProperty(this, '_bootstrapped', {
            value: Module,
            writable: false,
            enumerable: true,
        });

        if (false === this.instanceOnly) {
            Object.defineProperty(this, 'bootstrappedClass', {
                value: Module,
                writable: false,
                enumerable: true,
            });
        }

        Object.defineProperty(this, 'bootstrappedInstance', {
            value: new Module(),
            writable: false,
            enumerable: true,
        });

        return this;

    }

}

function assertDependencyCountMatch (resolvedDependencies, moduleWrapper) {
    if (resolvedDependencies.length !== moduleWrapper.numDependencies) {
        throw new Error(util.format(
            'Dependency miscount: Expected %s, got %s',
            moduleWrapper.numDependencies,
            resolvedDependencies.length
        ));
    }
}