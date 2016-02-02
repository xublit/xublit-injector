export var ref = '$aCoreModule';
export var inject = ['SomeFakeModule', 'someFakeModule', 'singletonModule'];
export function bootstrap (SomeFakeModule, someFakeModule, singletonModule) {

    class ACoreModule {

        constructor () {
            
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

    }

    return ACoreModule;

}