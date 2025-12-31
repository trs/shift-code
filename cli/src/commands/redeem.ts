import { Arguments } from 'yargs';
import { Session, ErrorCodes, redeem, account } from '@shift-code/api';
import { getShiftCodes } from '@shift-code/get';
import chalk from 'chalk';
import { readFile } from 'fs/promises';

import { saveAccount, appendCodeCache, loadMetaCache, loadAccountCache } from '../cache';
import { GameName, isGameName, PlatformName, isPlatformName, IPlatformName, IGameName } from '../names';

export interface RedeemFilter {
  platform?: IPlatformName[];
  game?: IGameName[];
}

export interface RedeemParameters extends RedeemFilter {
  codes?: string[];
  file?: string;
}

async function redeemCode(session: Session, code: string, filter: RedeemFilter): Promise<[cont: boolean, cache: boolean]> {
  try {
    let prevGameTitle: IGameName | string | undefined;

    process.stdout.write(`[${chalk.yellow(code)}] Redeeming...`);
    for await (const result of redeem(session, code, filter)) {
      const platform = isPlatformName(result.service) ? PlatformName[result.service] : result.service;
      const game = isGameName(result.title) ? GameName[result.title] : result.title;

      process.stdout.write("\r\x1b[K");
      if (prevGameTitle !== result.title) {
        const gameName = game ? ` ${game}` : '';
        console.log(`[${chalk.yellow(code)}]${gameName}`);
      }
      prevGameTitle = result.title;

      const scope = platform ? `[${platform}] ` : '';
      const message = `${scope}${result.status}`.trim();

      switch (result.error) {
        case ErrorCodes.Success:
          console.info(` > ${message}`);
          break;
        case ErrorCodes.LoginRequired:
          console.error(` > ${chalk.red('Failed to redeem due to invalid session. Please login again!')}`);
          return [false, false];
        case ErrorCodes.LaunchGame:
          console.error(` > ${chalk.redBright('You need to launch a Shift-enabled game to continue redeeming.')}`);
          return [false, false];
        case ErrorCodes.SkippedDueToFilter:
          console.error(` > ${message}`);
          return [true, false];
        default:
          console.error(` > ${message}`);
          break;
      }
    }

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(chalk.bgRed.white(message));
  }

  return [true, true];
}

async function* getCodesSource(args: Arguments<RedeemParameters>): AsyncGenerator<{code: string}> {
  if (args.codes && args.codes.length > 0) {
    for (const code of args.codes) {
      yield {code};
    }
  } else if (args.file) {
    const data = await readFile(args.file, 'utf8');
    for (const line of data.split('\n')) {
      const code = line.trim();
      if (code) {
        yield {code};
      }
    }
  } else {
    yield* getShiftCodes();
  }
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

  const source = getCodesSource(args);

  for await (const {code} of source) {
    if (codeCache.includes(code)) {
      console.info(`[${chalk.yellow(code)}] Code found in cache, skipping.`);
      continue;
    }

    const [cont, cache] = await redeemCode(session, code, {game: args.game, platform: args.platform});
    if (!cont) return;

    if (cache) {
      codeCache.push(code);
      await appendCodeCache(user.id, code);
    }
  }

  console.log(chalk.green('Complete'));
}
