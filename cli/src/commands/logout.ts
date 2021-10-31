import { Signale } from 'signale';
import { logout } from '@shift-code/api';

import { loadAccountSession, clearAccountSession } from '../cache';

export async function logoutCommand() {
  const log = new Signale();

  const session = await loadAccountSession();

  if (session) {
    await logout(session).catch(() => void 0);
    await clearAccountSession();
  }

  log.success('Logout successful!');
}
