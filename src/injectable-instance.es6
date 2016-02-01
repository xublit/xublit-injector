import Injectable from './injectable';

export default class InjectableInstance extends Injectable {

    constructor (moduleWrapper) {
        super(moduleWrapper);
    }

    get ref () {
        return this.moduleWrapper.instanceRef;
    }

}