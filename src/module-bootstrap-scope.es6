export default class ModuleBootstrapScope {

    constructor (scopeVars) {

        if ('$options' in scopeVars) {
            this.$options = function () {
                scopeVars.$options()
            };
        }

        Object.keys(scopeVars).forEach((key) => {

            var value = scopeVars[key];

            if ('$options' === key) {
                value = function () {

                };
            }

        });

        Object.assign(this, scopeVars);
        Object.freeze(this);
    }

}
