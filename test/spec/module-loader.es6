import * as path from 'path';

import { FAKE_BASE_DIR } from '../constants';
import { defaultModuleLoader } from '../../src/module-loader';

describe('The Xublit Injector\'s Default Module Loader', () => {

    var modules;

    it('should find all Xublit Modules in directories specified in 1st argument', () => {

        modules = defaultModuleLoader([FAKE_BASE_DIR]);

        expect(modules.length > 0).toBe(true);

    });

});