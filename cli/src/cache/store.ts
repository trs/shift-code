import {writeFile, readFile, readFileSync, stat, rm} from 'fs';
import {promisify} from 'util';
import path from 'path';
import os from 'os';
import mkdirp from 'mkdirp';

const {name} = JSON.parse(readFileSync(path.join(__dirname, '../../package.json')).toString('utf-8'));

const writeFileAsync = promisify(writeFile);
const readFileAsync = promisify(readFile);
const statAsync = promisify(stat);
const rmAsync = promisify(rm);

const homedir = os.homedir();
const {env} = process;

export const ACCOUNT_CACHE = 'account';
export const META_CACHE = '';
export const META_FILE = 'meta';
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

const getStoreFilePath = (cache: string, name: string) => path.join(getStorePath(), `${[cache, name].filter(Boolean).join('-')}.json`);

export async function storeExists(cache: string, id: string) {
  const filePath = getStoreFilePath(cache, id);
  try {
    const stat = await statAsync(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

export async function deleteStoreFile(cache: string, id: string) {
  const filePath = getStoreFilePath(cache, id);
  try {
    await rmAsync(filePath);
  } finally {
    return true;
  }
}

export async function storeContents<T>(cache: string, id: string, contents: T): Promise<string> {
  const filePath = getStoreFilePath(cache, id);
  const storePath = getStorePath();

  await mkdirp(storePath);
  await writeFileAsync(filePath, JSON.stringify(contents), {encoding: 'utf-8'});

  return filePath;
}

export async function loadContents<T>(cache: string, id: string, defaultContent?: T): Promise<T> {
  const filePath = getStoreFilePath(cache, id);

  try {
    const data = await readFileAsync(filePath, {encoding: 'utf-8'});
    const json = JSON.parse(data) as T;
    return json;
  } catch (err) {
    await storeContents(cache, id, JSON.stringify(defaultContent));

    return defaultContent ?? {} as T;
  }
}
