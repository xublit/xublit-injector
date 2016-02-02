import Injectable from './injectable';

export default class InjectableInstance extends Injectable {

    constructor (moduleWrapper) {

        super(moduleWrapper);

        Object.defineProperty(this, 'injectable', {
            value: new (moduleWrapper.bootstrapReturnValue)(),
        });

    }

    get ref () {
        return this.moduleWrapper.instanceRef;
    }

    get injectable () {
        return this.moduleWrapper
    }

}