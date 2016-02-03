export default class ModuleBootstrapScope {

    constructor (scopeVars) {
        Object.assign(this, scopeVars);
        Object.freeze(this);
    }

}
