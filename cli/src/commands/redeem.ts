import { Arguments } from 'yargs';
import { Session, ErrorCodes, redeem, account } from '@shift-code/api';
import { getShiftCodes } from '@shift-code/get';
import { Signale } from 'signale';

import { loadAccountSession, loadCodeCache, saveAccount, appendCodeCache } from '../cache';
import { GameName, isGameName, PlatformName, isPlatformName } from '../names';

export interface RedeemParameters {
  codes?: string[];
}

async function redeemCode(session: Session, code: string) {
  const log = new Signale({interactive: true}).scope(code);

  try {
    log.await('Redeeming...');
    for await (const result of redeem(session, code)) {
      const game = isGameName(result.title) ? GameName[result.title] : result.title;
      const platform = isPlatformName(result.service) ? PlatformName[result.service] : result.service;

      let scope = [platform, game].filter(Boolean).join(', ');
      scope = scope ? `(${scope}) ` : '';

      const message = `${scope}${result.status}`.trim();

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
    }

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    log.fatal(message);
  }

  return true;
}

export async function redeemCommand(args: Arguments<RedeemParameters>) {
  const log = new Signale();

  const session = await loadAccountSession();
  if (!session) {
    log.error('No active user, please login.');
    log.note('$ shift-code login');
    return;
  }

  const user = await account(session);
  await saveAccount(user);

  log.scope(user.email).info('Starting code redemption');
  log.unscope();

  const cache = await loadCodeCache() ?? [];

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
    await appendCodeCache(code);
  }

  log.star('Complete');
}
