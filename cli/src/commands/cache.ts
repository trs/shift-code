import chalk from 'chalk';

import { clearCodeCache, loadAccountCache, loadMetaCache } from '../cache';

export async function cacheCommand() {
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

  await clearCodeCache(user.account.id);

  console.info(`Cache cleared for ${chalk.bold(user.account.email)}`);
}
