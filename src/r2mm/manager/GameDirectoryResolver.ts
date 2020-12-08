import R2Error from '../../model/errors/R2Error';
import FileNotFoundError from '../../model/errors/FileNotFoundError';
import VdfParseError from '../../model/errors/Vdf/VdfParseError';

import child from 'child_process';
import * as vdf from '@node-steam/vdf';
import * as path from 'path';
import { homedir } from 'os';
import ManagerSettings from './ManagerSettings';
import FsProvider from "../../providers/generic/file/FsProvider";

const win32_installDirectoryQuery = 'Get-ItemProperty -Path HKLM:\\SOFTWARE\\WOW6432Node\\Valve\\Steam -Name "InstallPath"';
const appManifest = 'appmanifest_632360.acf';

export default class GameDirectoryResolver {

    public static win32_getSteamDirectory(): string {
        const queryResult: string = child.execSync(`powershell.exe "${win32_installDirectoryQuery}"`).toString().trim();
        const installKeyValue = queryResult.split('\n');
        let installValue: string = '';
        installKeyValue.forEach((val: string) => {
            if (val.trim().startsWith('InstallPath')) {
                installValue = val.substr(('InstallPath').length)
                    .trim()
                    // Remove colon
                    .substr(1)
                    .trim();
            }
        });
        if (installValue.trim().length === 0) {
            const err = new Error();
            err.message = queryResult;
            throw err;
        }
        return installValue;
    }

    public static async getSteamDirectory(): Promise<string | R2Error> {
        const settings = await ManagerSettings.getSingleton();
        if (settings.steamDirectory != null) {
            return settings.steamDirectory;
        }
        try {
            switch(process.platform){
                case 'win32':
                    return this.win32_getSteamDirectory();
                case 'linux':
                    const dirs = [
                        path.resolve(homedir(), '.local', 'share', 'Steam'),
                        path.resolve(homedir(), '.var', 'app', 'com.valvesoftware.Steam', '.local', 'share', 'Steam')
                    ];
                    for(let dir of dirs){
                        if(await FsProvider.instance.exists(dir))
                            return dir;
                    }
                    throw new Error('Steam is not installed');
                default:
                    throw new Error('Unsupported platform');
            }
        } catch(e) {
            const err: Error = e;
            return new R2Error(
                'Unable to resolve steam install directory',
                err.message,
                'Try manually setting the Steam directory through the settings'
            )
        }
    }

    public static async getDirectory(): Promise<R2Error | string> {
        const settings = await ManagerSettings.getSingleton();
        if (settings.riskOfRain2Directory != null) {
            return settings.riskOfRain2Directory;
        }
        try {
            const installValue = await this.getSteamDirectory();
            if(installValue instanceof R2Error)
                throw installValue;

            const dir = await this.findAppManifest(installValue);
            return dir;
        } catch(e) {
            const err: Error = e;
            return new R2Error(
                'Unable to resolve the Risk of Rain 2 install directory',
                err.message,
                'Try manually locating the Risk of Rain 2 install directory through the settings'
            )
        }
    }

    private static async findAppManifest(steamPath: string): Promise<R2Error | string> {
        const steamapps = path.join(steamPath, 'steamapps');
        const locations: string[] = [steamapps];
        const fs = FsProvider.instance;
        // Find all locations where games can be installed.
        try {
            const files = await fs.readdir(steamapps);
            for (const file of files) {
                if (file.toLowerCase() === 'libraryfolders.vdf') {
                    try {
                        const parsedVdf: any = vdf.parse((await fs.readFile(path.join(steamapps, file))).toString());
                        for (const key in parsedVdf.LibraryFolders) {
                            if (!isNaN(Number(key))) {
                                locations.push(
                                    path.join(parsedVdf.LibraryFolders[key], 'steamapps')
                                );
                            }
                        }
                    } catch(e) {
                        const err: Error = e;
                        // Need to throw when inside forEach.
                        throw new VdfParseError(
                            'Unable to parse libraryfolders.vdf',
                            err.message,
                            null
                        )
                    }
                }
            }
        } catch(e) {
            if (e instanceof R2Error) {
                return e;
            }
            const err: Error = e;
            return new FileNotFoundError(
                'Unable to read directory',
                err.message,
                null
            )
        }
        // Look through given directories for ${appManifest}
        let manifestLocation: string | null = null;
        try {
            for (const location of locations) {
                (await fs.readdir(location))
                    .forEach((file: string) => {
                        if (file.toLowerCase() === appManifest) {
                            manifestLocation = location;
                        }
                    });
            }
        } catch(e) {
            if (e instanceof R2Error) {
                return e;
            }
            const err: Error = e;
            return new R2Error(
                'An error occured whilst searching Steam library locations',
                err.message,
                null
            )
        }
        if (manifestLocation === null) {
            return new FileNotFoundError(
                'Unable to locate Risk of Rain 2 Installation Directory',
                `Searched locations: ${locations}`,
                null
            )
        }
        // Game manifest found at ${manifestLocation}
        try {
            const manifestVdf: string = (await fs.readFile(path.join(manifestLocation, appManifest))).toString();
            const parsedVdf: any = vdf.parse(manifestVdf);
            const folderName = parsedVdf.AppState.installdir;
            const riskOfRain2Path = path.join(manifestLocation, 'common', folderName);
            if (await fs.exists(riskOfRain2Path)) {
                return riskOfRain2Path;
            } else {
                return new FileNotFoundError(
                    'Risk of Rain 2 does not exist in Steam\'s specified location',
                    `Failed to find directory: ${riskOfRain2Path}`,
                    null
                )
            }
        } catch(e) {
            const err: Error = e;
            return new R2Error(
                `An error occured whilst locating the Risk Of Rain 2 install directory from manifest in ${manifestLocation}`,
                err.message,
                null
            )
        }
    }

}
