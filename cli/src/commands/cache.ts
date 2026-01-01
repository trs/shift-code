import chalk from 'chalk';
import { Arguments } from 'yargs';

import { AccountCache, clearCodeCache, loadAccountCache, loadMetaCache, removeCodeCache } from '../cache';

export interface CacheRemoveParameters {
  code: string;
}

export async function cacheClearCommand() {
  const user = await getUser();
  if (!user?.account) return;

  await clearCodeCache(user.account.id);

  console.info(`Cache cleared for ${chalk.bold(user.account.email)}`);
}

export async function cacheRemoveCommand(args: Arguments<CacheRemoveParameters>) {
  const user = await getUser();
  if (!user?.account) return;

  await removeCodeCache(user.account.id, args.code);

  console.info(`Code removed from cache for ${chalk.bold(user.account.email)}`);
}

async function getUser(): Promise<AccountCache | undefined> {
  const {activeAccountID} = await loadMetaCache();
  if (!activeAccountID) {
    console.error('No active user, please login.');
    console.info('$ shift-code login');
    return;
  }

  const user = await loadAccountCache(activeAccountID);
  if (!user.account) {
    console.error('No active user, please login.');
    console.info('$ shift-code login');
    return;
  }

  return user;
}