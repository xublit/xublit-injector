export var name = 'SomeFakeModule';
export var inject = ['AbstractFakeModule'];
export function bootstrap (AbstractFakeModule) {

    class SomeFakeModule extends AbstractFakeModule {

        constructor () {
            super();
        }

        get anotherVar () {
            return 'bar';
        }

    }

    return SomeFakeModule;

}