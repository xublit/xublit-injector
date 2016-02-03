import * as util from 'util';

export function missingDependencyHandler (moduleRef, dependencyRef, index) {

    throw new Error(util.format(
        'Missing dependency "%s" for "%s" module init.  Ref index: %s',
        dependencyRef,
        moduleRef,
        index
    ));

}