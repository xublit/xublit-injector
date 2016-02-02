import Injectable from './injectable';

export default class InjectableClass extends Injectable {

    constructor (moduleWrapper) {

        super(moduleWrapper);

        Object.defineProperty(this, 'injectable', {
            value: moduleWrapper.bootstrapReturnValue,
        });

    }

}