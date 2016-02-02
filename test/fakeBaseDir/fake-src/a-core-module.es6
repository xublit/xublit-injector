export var ref = '$aCoreModule';
export var inject = ['SomeFakeModule', 'singletonModule'];
export function bootstrap (SomeFakeModule, singletonModule) {

    console.log(SomeFakeModule);

    class ACoreModule {

        constructor () {
            
            this.someFakeModule = new SomeFakeModule();
            this.singletonModule = singletonModule;

        }

    }

    return ACoreModule;

}