import { Arguments } from 'yargs';
import { Session, ErrorCodes, redeem, account } from '@shift-code/api';
import { getShiftCodes } from '@shift-code/get';
import chalk from 'chalk';

import { saveAccount, appendCodeCache, loadMetaCache, loadAccountCache } from '../cache';
import { GameName, isGameName, PlatformName, isPlatformName } from '../names';

export interface RedeemParameters {
  codes?: string[];
}

async function redeemCode(session: Session, code: string) {
  try {
    process.stdout.write(`[${chalk.gray(code)}] Redeeming...\r`);
    for await (const result of redeem(session, code)) {
      const game = isGameName(result.title) ? GameName[result.title] : result.title;
      const platform = isPlatformName(result.service) ? PlatformName[result.service] : result.service;

      let scope = [platform, game].filter(Boolean).join(', ');
      scope = scope ? `(${scope}) ` : '';

      const message = `${scope}${result.status}`.trim();

      switch (result.error) {
        case ErrorCodes.Success:
          console.info(`[${chalk.gray(code)}] ${message}`);
          break;
        case ErrorCodes.LoginRequired:
          console.error(`[${chalk.gray(code)}] ${chalk.red('Failed to redeem due to invalid session. Please login again!')}`);
          return false;
        case ErrorCodes.LaunchGame:
          console.error(`[${chalk.gray(code)}] ${chalk.redBright('You need to launch a Borderlands game to continue redeeming.')}`);
          return false;
        default:
          console.error(`[${chalk.gray(code)}] ${message}`);
          break;
      }
    }

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(chalk.bgRed.white(message));
  }

  return true;
}

export async function redeemCommand(args: Arguments<RedeemParameters>) {
  const {activeAccountID} = await loadMetaCache();
  if (!activeAccountID) {
    console.error('No active user, please login.');
    console.info('$ shift-code login');
    return;
  }

  const {session, codes} = await loadAccountCache(activeAccountID);
  if (!session) {
    console.error('No active user, please login.');
    console.info('$ shift-code login');
    return;
  }

  const user = await account(session);
  await saveAccount(user.id, user);

  console.info(`Starting code redemption for: ${chalk.bold(user.email)}`);

  const codeCache = codes ?? [];

  const source = args.codes ? args.codes.map((code) => ({code})) : getShiftCodes();

  for await (const {code} of source) {
    if (codeCache.includes(code)) {
      console.info(`[${chalk.gray(code)}] Code found in cache, skipping.`);
      continue;
    }

    const cont = await redeemCode(session, code);
    if (!cont) return;

    codeCache.push(code);
    await appendCodeCache(user.id, code);
  }

  console.log(chalk.green('Complete'));
}
