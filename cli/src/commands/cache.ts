import { Signale } from 'signale';

import { clearCodeCache, loadAccount } from '../cache';

export async function cacheCommand() {
  const log = new Signale({interactive: true});

  const account = await loadAccount();
  if (!account) {
    log.error('No active user, please login.');
    log.note('$ shift-code login');
    return;
  }

  log.scope(account.email);

  log.await('Clearing cache...');

  await clearCodeCache();

  log.success('Cache cleared');
}
