import { logout } from '@shift-code/api';
import chalk from 'chalk';

import { loadAccountCache, clearAccountSession, loadMetaCache, clearMetaActiveAccount } from '../cache';

export async function logoutCommand() {
  const cache = await loadMetaCache();
  if (cache.activeAccountID) {
    const {session} = await loadAccountCache(cache.activeAccountID);
    if (session) {
      await logout(session).catch(() => void 0);
      await clearAccountSession(cache.activeAccountID);
    }
    await clearMetaActiveAccount(cache.activeAccountID);
  }

  console.log(chalk.green('Logout successful'));
}
