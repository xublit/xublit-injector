export var ref = 'singletonModule';
export var inject = ['aDeepModule'];
export function bootstrap (aDeepModule) {

    class SingletonModule {

        constructor () {

        }

        get aDeepModule () {
            return aDeepModule;
        }

    }

    return SingletonModule;

}