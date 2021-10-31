import { Session, account } from '@shift-code/api';
import { cacheExists, saveAccount, saveAccountSession, saveActiveAccount, saveCodeCache } from '.';
import { CacheStore } from '../types';
import { SESSION_FILE, CACHE_FILE, loadContents, deleteStoreFile } from './store';

export async function migrateOldCache() {
  if (await cacheExists()) {
    return;
  }

  const session = await loadContents<Session>(SESSION_FILE);
  const user = await account(session)
    .catch(() => null);

  if (user) {
    await saveActiveAccount(user.id);
    await saveAccountSession(user.id, session);
    await saveAccount(user);
  }

  const codes = await loadContents<CacheStore>(CACHE_FILE, []);
  await saveCodeCache(codes);

  // await Promise.all([
  //   deleteStoreFile(SESSION_FILE),
  //   deleteStoreFile(CACHE_FILE)
  // ]);
}
