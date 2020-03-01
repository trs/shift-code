import { Arguments } from 'yargs';
import { Session, ErrorCodes, redeem, account } from 'shift-code-api';
import { getShiftCodes, ShiftCode } from 'shift-code-source';
import { Signale } from 'signale';

import { loadContents, storeContents, SESSION_FILE, CACHE_FILE } from '../store';
import { CacheStore } from '../types';

export interface RedeemParameters {
  codes?: string[];
}

type RedeemableCode = Partial<ShiftCode> & {code: string};

function getGameTitle(title?: string, defaultValue?: string) {
  if (!title) return defaultValue;

  switch (title) {
    case 'bl1': return 'Borderlands 1';
    case 'bl2': return 'Borderlands 2';
    case 'tps': return 'Borderlands TPS';
    case 'bl3': return 'Borderlands 3';
    default: return title;
  }
}

function getServiceName(service?: string, defaultValue?: string) {
  if (!service) return defaultValue;

  switch (service) {
    case 'xbox': return 'Xbox';
    case 'epic': return 'Epic Games';
    case 'steam': return 'Steam';
    case 'psn': return 'Playstation';
    default: return service;
  }
}

async function redeemCode(session: Session, shift: RedeemableCode) {
  const log = new Signale({interactive: true}).scope(shift.code);

  try {
    log.await('Redeeming...');
    for await (const result of redeem(session, shift.code)) {
      const title = getGameTitle(result.title, 'game');
      const service = getServiceName(result.service, 'service');

      switch (result.error) {
        case ErrorCodes.Success:
          log.success('Redeemed %s in %s on %s', shift.reward ?? 'code', title, service);
          break;
        case ErrorCodes.AlreadyRedeemed:
          log.error('Code has already been redeemed in %s on %s.', title, service);
          break;
        case ErrorCodes.LoginRequired:
          log.fatal('Failed to redeem code due to invalid session. Please login again!');
          return false;
        case ErrorCodes.LaunchGame:
          log.fatal('You need to launch a Borderlands game to continue redeeming.');
          return false;
        default:
          log.error('Failed to redeem code in %s on %s, got error: %s', title, service, result.status);
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

  for await (const shift of source) {
    if (cache.includes(shift.code)) {
      log.scope(shift.code).note('Code found in cache, skipping.');
      log.unscope();
      continue;
    }

    const cont = await redeemCode(session, shift);
    if (!cont) return;

    cache.push(shift.code);
    await storeContents(CACHE_FILE, cache);
  }

  log.star('Complete');
}
