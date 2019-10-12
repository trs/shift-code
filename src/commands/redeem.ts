import { Arguments } from 'yargs';
import { Session, redeemAll } from 'shift-code-api';

import { loadContents, SESSION_FILE } from '../store';
import { shiftCodeStream } from '../stream';
import { PassThrough, Transform } from 'stream';
import { sleep } from '../helpers';

export interface RedeemParameters {
  code?: string[];
}

function getCodeStream(codes?: string[]) {
  if (codes) {
    const stream = new PassThrough({
      objectMode: true
    });
    codes.forEach((code) => stream.write(code));
    return stream;
  }

  return shiftCodeStream();
}

export async function redeemCommand(args: Arguments<RedeemParameters>) {
  const sessionContents = await loadContents(SESSION_FILE);
  const session = JSON.parse(sessionContents) as Session;

  const stream = getCodeStream(args.code)
    .pipe(new Transform({
      objectMode: true,
      async transform({code}, encoding, cb) {
        const results = await redeemAll(session, code);
        for (const result of results) {
          this.push(result);
        }
        await sleep(5000);
        cb();
      }
    }))
    .on('data', (result) => {
      console.log(result);
    })

  return new Promise((resolve, reject) => {
    stream.once('end', () => resolve());
    stream.once('error', (err) => reject(err));
  });
}
