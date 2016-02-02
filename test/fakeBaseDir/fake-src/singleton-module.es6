export var name = 'singletonModule';
export var inject = [];
export function bootstrap () {

    class SingletonModule {

        constructor () {

        }

        doSomething () {
            return 'Something...';
        }

    }

    return SingletonModule;

}