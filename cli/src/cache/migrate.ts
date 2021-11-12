import { Session, account } from '@shift-code/api';
import { metaCacheExists, saveAccount, saveAccountSession, saveMetaActiveAccount, saveCodeCache, saveMetaAccount } from '.';
import { SESSION_FILE, CACHE_FILE, loadContents, deleteStoreFile } from './store';

export async function migrateOldCache() {
  if (await metaCacheExists()) {
    return;
  }

  const codes = await loadContents<string[]>('', CACHE_FILE, []);
  const session = await loadContents<Session>('', SESSION_FILE);
  const user = await account(session)
    .catch(() => null);

  if (user) {
    await saveMetaAccount(user.id);
    await saveMetaActiveAccount(user.id);
    await saveAccountSession(user.id, session);
    await saveAccount(user.id, user);

    await saveCodeCache(user.id, codes);
  }

  await Promise.all([
    deleteStoreFile('', SESSION_FILE),
    deleteStoreFile('', CACHE_FILE)
  ]);
}
