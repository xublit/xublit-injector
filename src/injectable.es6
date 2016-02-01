export default class Injectable {

    constructor (moduleWrapper) {
        
        this._moduleWrapper = moduleWrapper;

    }

    get moduleWrapper () {
        return this._moduleWrapper;
    }

    get ref () {
        return this.moduleWrapper.ref;
    }

}