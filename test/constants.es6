import path from 'path';

export const FAKE_ROOT_DIR = path.resolve('./fakeRoot');
export const FAKE_BASE_DIR = path.join(
    FAKE_ROOT_DIR, 'test', 'fakes', 'injectorModules'
); 