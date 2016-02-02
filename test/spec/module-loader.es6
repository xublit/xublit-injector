import * as path from 'path';

import { FAKE_BASE_DIR } from '../constants';
import { parsePath, wildcardDirnameToRegExp, loadModulesIn } from '../../src/module-loader';

describe('The Xublit Injector\'s Default Module Loader', () => {

    describe('wildcardDirnameToRegExp(dirname)', () => {

        it('should return /^wildcard-[A-Z-_.]+$/ when value of first argument is "wildcard-*"', () => {
            
            var result = wildcardDirnameToRegExp('wildcard-*');

            expect(result)
                .toEqual(jasmine.any(RegExp));

            expect(result.source)
                .toEqual('^wildcard-[A-Z-_.]+$');

        });

    });

    describe('parsePath(includeDirPath)', () => {

        var parsedPath;

        describe('return value', () => {

            describe('in any case', () => {

                it('should return an object', () => {
                    expect(parsePath('')).toEqual(jasmine.any(Object));
                });

            });

            describe('where the value for the first argument is "/some/dir"', () => {

                beforeEach(() => {
                    parsedPath = parsePath('/some/dir');
                });

                it('should include a property "searchDir" - the value of which should be "/some/dir"', () => {
                    expect(parsedPath).toEqual(jasmine.objectContaining({
                        searchDir: '/some/dir',
                    }));
                });

                it('should include a property "includeDirs" - the value of which should be undefined', () => {
                    expect(parsedPath).toEqual(jasmine.objectContaining({
                        includeDirs: undefined,
                    }));
                });

            });

            describe('where the value for the first argument is "/some/dir/wildcard-*"', () => {

                beforeEach(() => {
                    parsedPath = parsePath('/some/dir/wildcard-*');
                });

                it('should include a property "searchDir" - the value of which should be "/some/dir"', () => {
                    expect(parsedPath).toEqual(jasmine.objectContaining({
                        searchDir: '/some/dir',
                    }));
                });

                it('should include a property "includeDirs" - the value of which should be a RegExp', () => {
                    expect(parsedPath).toEqual(jasmine.objectContaining({
                        includeDirs: jasmine.any(RegExp),
                    }));
                });

            });

        });

    });

    describe('loadModulesIn(includeDirPaths)', () => {

        var modules;

        it('should find all Xublit Modules in directories specified in 1st argument', () => {
            
            modules = loadModulesIn([
                path.join(FAKE_BASE_DIR, 'fake-src'),
            ]);

            expect(modules.length).toBe(5);

        });

        it('should follow the (odd?) pattern around wildcards', () => {

            modules = loadModulesIn([
                FAKE_BASE_DIR,
                path.join(FAKE_BASE_DIR, 'fake-node_modules', 'xublit-*'),
            ]);

            expect(modules.length).toBe(7);

        });

    });

});