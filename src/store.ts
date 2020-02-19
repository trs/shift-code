// eslint-disable-next-line @typescript-eslint/no-var-requires
const {name} = require('../package.json');

import {writeFile, readFile} from 'fs';
import {promisify} from 'util';
import path from 'path';
import os from 'os';
import mkdirp from 'mkdirp';

const writeFileAsync = promisify(writeFile);
const readFileAsync = promisify(readFile);

const homedir = os.homedir();
const {env} = process;

export const SESSION_FILE = 'session';
export const CACHE_FILE = 'cache';

export function getStorePath() {
  // macos
  if (process.platform === 'darwin') {
    const library = path.join(homedir, 'Library');

    return path.join(library, 'Application Support', name);
  }

  // windows
  if (process.platform === 'win32') {
    const localAppData = env.LOCALAPPDATA || path.join(homedir, 'AppData', 'Local');

    return path.join(localAppData, name, 'Data');
  }

  // linux
  return path.join(env.XDG_DATA_HOME || path.join(homedir, '.local', 'share'), name);
}

const getFilePath = (name: string) => path.join(getStorePath(), `${name}.json`);

export async function storeContents<T>(name: string, contents: T): Promise<string> {
  const filePath = getFilePath(name);
  const storePath = getStorePath();

  await mkdirp(storePath);
  await writeFileAsync(filePath, JSON.stringify(contents));

  return filePath;
}

export async function loadContents<T>(name: string, defaultContent?: T): Promise<T> {
  const filePath = getFilePath(name);

  try {
    const data = await readFileAsync(filePath);
    const json = JSON.parse(data.toString()) as T;
    return json;
  } catch (err) {
    await storeContents(name, JSON.stringify(defaultContent));

    return defaultContent ?? {} as T;
  }
}
