import 'mocha';
import { expect } from 'chai';
import LogOutput from '../../../src/r2mm/data/LogOutput';
import Profile from '../../../src/model/Profile';
import TestSetup from '../../test-setup.test';
import FsProvider from '../../../src/providers/generic/file/FsProvider';
import * as path from "path";
import FileUtils from '../../../src/utils/FileUtils';
import PathResolver from '../../../src/r2mm/manager/PathResolver';

const timeout = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('LogOutput', () => {

    before(() => {
        TestSetup.setUp();
    });

    after(() => {
        TestSetup.tearDown();
    });

    context('Singleton construction', () => {
        it('Singletons should be the same object', () => {
            expect(LogOutput.getSingleton()).equals(LogOutput.getSingleton());
        });
    });

    context('LogOutput exists', () => {
        it('File exists', async () => {
            const fs = FsProvider.instance;
            // Ensure directory exists prior to writing file
            await FileUtils.ensureDirectory(path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx'));
            await FileUtils.emptyDirectory(path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx'));
            await fs.writeFile(path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'LogOutput.log'), "");
            await timeout(1100);
            expect(LogOutput.getSingleton().exists).equals(true);
        });
    });

});

after(async () => {
    // Interval is required to be disconnected to allow test runner to close.
    LogOutput.getSingleton().disconnect();
})
