import { chmodSync, existsSync, promises } from 'node:fs';
import { env } from 'node:process';

import { addPath, debug, exportVariable, warning } from '@actions/core';
import { exec } from '@actions/exec';
import { cacheFile, downloadTool, find } from '@actions/tool-cache';
import {extractErrorMessage} from "../lib/utils.js";

const EW_CLI_URL = "https://maven.emulator.wtf/releases/ew-cli";

export default async function setupEwCli(version: string): Promise<void> {
  try {
    exportVariable('EW_VERSION', version);

    const binPath = `${env.HOME}/.cache/emulator-wtf/bin`;
    debug(`Creating ${binPath}`);
    await promises.mkdir(binPath, { recursive: true });

    const executable = `${binPath}/ew-cli`;
    if (!existsSync(executable)) {
      debug(`${executable} doesn't exist, looking in cache`);
      const cachedCli = find('emulatorwtf-wrapper', version);
      if (cachedCli.length > 0) {
        debug(`ew-cli found in cache, restoring....`);
        await promises.copyFile(`${cachedCli}/ew-cli`, executable);
      } else {
        debug(`ew-cli not found in cache, downloading....`);
        const path = await downloadTool(EW_CLI_URL);
        await cacheFile(path, 'ew-cli', 'emulatorwtf-wrapper', version);
        await promises.copyFile(path, executable);
      }
    }
    chmodSync(executable, 0o755);
    addPath(binPath);

    const cachedJar = find('emulatorwtf-jar', version);
    debug(`looking for jar in cache!`);
    if (cachedJar.length > 0) {
      debug(`Jar found in cache!`);
      await promises.copyFile(`${cachedJar  }/ew-cli.jar`, `${env.HOME}/.cache/emulator-wtf/ew-cli-${version}.jar`);
    }

    await exec('ew-cli --version');

    if (cachedJar === '') {
      debug(`Caching jar...`);
      await cacheFile(`${env.HOME}/.cache/emulator-wtf/ew-cli-${version}.jar`, 'ew-cli.jar', 'emulatorwtf-jar', version);
    }
  } catch (e) {
    const msg = extractErrorMessage(e)
    warning(`ew-cli installation failed: ${msg}`);
    throw e
  }
}
