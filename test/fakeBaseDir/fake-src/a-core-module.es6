export var name = '$aCoreModule';
export var inject = ['SomeFakeModule', 'singletonModule'];
export function bootstrap (SomeFakeModule, singletonModule) {

    class ACoreModule {

        constructor () {
            
            this.someFakeModule = new SomeFakeModule();
            this.singletonModule = singletonModule;

        }

    }

    return ACoreModule;

}