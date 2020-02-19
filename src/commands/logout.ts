import { Signale } from 'signale';
import { Session, logout } from 'shift-code-api';

import { loadContents, storeContents, SESSION_FILE } from '../store';

export async function logoutCommand() {
  const session = await loadContents<Session>(SESSION_FILE);

  await logout(session);
  await storeContents<any>(SESSION_FILE, {});

  const log = new Signale();
  log.success('Logout successful!');
}
