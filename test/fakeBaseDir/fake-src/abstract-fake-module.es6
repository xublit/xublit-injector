export var ref = 'AbstractFakeModule';
export var inject = [];
export function bootstrap () {

    class AbstractFakeModule {

        constructor () {

            if ('AbstractFakeModule' === this.constructor.name) {
                throw new Error('Abstract class cannot be instantiated');
            }

        }

        get someVar () {
            return 'foo';
        }

    }

    return AbstractFakeModule;

}