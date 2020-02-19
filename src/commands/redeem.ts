import { Arguments } from 'yargs';
import { Session, ErrorCodes, redeem } from 'shift-code-api';
import { getShiftCodes } from 'shift-code-source';
import { Signale } from 'signale';

import { loadContents, storeContents, SESSION_FILE, CACHE_FILE } from '../store';
import { CacheStore } from '../types';

export interface RedeemParameters {
  code?: string[];
}

async function redeemCode(session: Session, code: string) {
  const log = new Signale({interactive: true}).scope(code);
  const errorLog = new Signale();

  try {
    log.await('Redeeming...');
    const results = await redeem(session, code);
    for (const result of results) {
      let scope = [result.service, result.title].filter(Boolean).join(', ');
      scope = scope ? `(${scope}) ` : ''

      const message = `${scope}${result.status}`;

      switch (result.error) {
        case ErrorCodes.Success:
          log.success(message);
          break;
        case ErrorCodes.LoginRequired:
          errorLog.fatal('Failed to redeem due to invalid session. Please login again!');
          errorLog.note('$ shift-code-redeemer login');
          return false;
        case ErrorCodes.LaunchGame:
          errorLog.fatal('You need to launch a Borderlands game to continue redeeming.');
          return false;
        default:
          log.error(message);
          break;
      }
    }

  } catch (err) {
    log.fatal(err.message);
  }

  console.log();
  return true;
}

export async function redeemCommand(args: Arguments<RedeemParameters>) {
  const log = new Signale();

  const session = await loadContents<Session>(SESSION_FILE);

  if (Object.keys(session).length === 0) {
    log.error('Please login first!');
    log.note('$ shift-code-redeemer login');
    return;
  }
  
  const cache = await loadContents<CacheStore>(CACHE_FILE, []);

  for await (const {code} of getShiftCodes()) {
    if (cache.includes(code)) continue;

    const cont = await redeemCode(session, code);
    if (!cont) return;

    cache.push(code);
    await storeContents(CACHE_FILE, cache);
  }

  log.star('Complete');
}
