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

export const SESSION_FILE = 'session';
export const CACHE_FILE = 'cache';
export const ACCOUNT_FILE = 'account';

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

const getStoreFilePath = (name: string) => path.join(getStorePath(), `${name}.json`);

export async function storeExists(name: string) {
  const filePath = getStoreFilePath(name);
  console.log(filePath)
  try {
    const stat = await statAsync(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

export async function deleteStoreFile(name: string) {
  const filePath = getStoreFilePath(name);
  try {
    await rmAsync(filePath);
  } finally {
    return true;
  }
}

export async function storeContents<T>(name: string, contents: T): Promise<string> {
  const filePath = getStoreFilePath(name);
  const storePath = getStorePath();

  await mkdirp(storePath);
  await writeFileAsync(filePath, JSON.stringify(contents));

  return filePath;
}

export async function loadContents<T>(name: string, defaultContent?: T): Promise<T> {
  const filePath = getStoreFilePath(name);

  try {
    const data = await readFileAsync(filePath);
    const json = JSON.parse(data.toString()) as T;
    return json;
  } catch (err) {
    await storeContents(name, JSON.stringify(defaultContent));

    return defaultContent ?? {} as T;
  }
}
