import { Signale } from 'signale';

import { loadCache } from '../cache';

export async function accountCommand() {
  const log = new Signale();

  const cache = await loadCache();
  const accounts = Object.values(cache.accounts ?? {});
  if (accounts.length === 0) {
    log.info('No saved accounts, login to add one.');
    log.note('$ shift-code login');
    return;
  }

  log.info('Saved accounts:');
  for (const user of accounts) {
    const isActiveAccount = typeof cache.activeAccountID === 'string'
      && cache.activeAccountID === user.account?.id;
    // log.info(`  ID:     ${user.account?.id}`);
    log.info(`  Name:   ${user.account?.name}`);
    log.info(`  Email:  ${user.account?.email}`);
    log.info(`  Active: ${isActiveAccount ? 'Y' : ''}`);
  }
}
