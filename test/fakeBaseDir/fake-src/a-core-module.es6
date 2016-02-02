export var ref = '$aCoreModule';
export var inject = ['AnotherModule', 'SomeFakeModule', 'someFakeModule', 'singletonModule'];
export function bootstrap (AnotherModule, SomeFakeModule, someFakeModule, singletonModule) {

    var injector = this.injector();

    class ACoreModule {

        constructor () {
            
        }

        get AnotherModule () {
            return AnotherModule;
        }

        get SomeFakeModule () {
            return SomeFakeModule;
        }

        get someFakeModule () {
            return someFakeModule;
        }

        get singletonModule () {
            return singletonModule;
        }

        get injector () {
            return injector;
        }

    }

    return ACoreModule;

}