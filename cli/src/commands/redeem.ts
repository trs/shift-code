import { Arguments } from 'yargs';
import { Session, ErrorCodes, redeem, account } from 'shift-code-api';
import { getShiftCodes } from 'shift-code-source';
import { Signale } from 'signale';

import { loadContents, storeContents, SESSION_FILE, CACHE_FILE } from '../store';
import { CacheStore } from '../types';

export interface RedeemParameters {
  codes?: string[];
}

async function redeemCode(session: Session, code: string) {
  const log = new Signale({interactive: true}).scope(code);

  try {
    log.await('Redeeming...');
    for await (const result of redeem(session, code)) {
      let scope = [result.service, result.title].filter(Boolean).join(', ');
      scope = scope ? `(${scope}) ` : '';

      const message = `${scope}${result.status}`;

      switch (result.error) {
        case ErrorCodes.Success:
          log.success(message);
          break;
        case ErrorCodes.LoginRequired:
          log.fatal('Failed to redeem due to invalid session. Please login again!');
          return false;
        case ErrorCodes.LaunchGame:
          log.fatal('You need to launch a Borderlands game to continue redeeming.');
          return false;
        default:
          log.error(message);
          break;
      }
      console.log();
    }

  } catch (err) {
    log.fatal(err.message);
    console.log();
  }

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

  const acc = await account(session);
  log.scope(acc.email).info('Starting code redemption');
  log.unscope();

  const cache = await loadContents<CacheStore>(CACHE_FILE, []);

  const source = args.codes ? args.codes.map((code) => ({code})) : getShiftCodes();

  for await (const {code} of source) {
    if (cache.includes(code)) {
      log.scope(code).note('Code found in cache, skipping.');
      log.unscope();
      continue;
    }

    const cont = await redeemCode(session, code);
    if (!cont) return;

    cache.push(code);
    await storeContents(CACHE_FILE, cache);
  }

  log.star('Complete');
}
