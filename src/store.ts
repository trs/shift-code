// eslint-disable-next-line @typescript-eslint/no-var-requires
const {name} = require('../package.json');

import {writeFile, readFile} from 'fs';
import path from 'path';
import os from 'os';
import mkdirp from 'mkdirp';

const homedir = os.homedir();
const {env} = process;

export const SESSION_FILE = 'session';

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

export async function storeContents(name: string, contents: string) {
  const filePath = getFilePath(name);

  await new Promise<void>((resolve, reject) => {
    mkdirp(getStorePath(), (err) => {
      if (err) reject(err);
      else resolve();
    });
  })

  return await new Promise<string>((resolve, reject) => {
    writeFile(filePath, contents, (err) => {
      if (err) reject(err);
      else resolve(filePath);
    });
  });
}

export async function loadContents(name: string) {
  const filePath = getFilePath(name);

  return await new Promise<string>((resolve, reject) => {
    readFile(filePath, (err, data) => {
      if (err) reject(err);
      else resolve(data.toString());
    });
  });
}
