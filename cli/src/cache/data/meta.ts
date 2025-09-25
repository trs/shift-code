import { loadContents, META_CACHE, META_FILE, storeContents, storeExists } from "../store";

export type MetaCache = {
  activeAccountID?: string;
  accounts?: string[];
}

export async function metaCacheExists() {
  const exists = await storeExists(META_CACHE, META_FILE);
  return exists;
}

export async function loadMetaCache() {
  const cache = await loadContents<MetaCache>(META_CACHE, META_FILE, {});
  return cache;
}

export async function saveMetaCache(data: Partial<MetaCache>) {
  await storeContents(META_CACHE, META_FILE, data);
}

export async function saveMetaActiveAccount(accountID: string) {
  const cache = await loadMetaCache();
  cache.activeAccountID = accountID;

  await saveMetaCache(cache);
}

export async function saveMetaAccount(accountID: string) {
  const cache = await loadMetaCache();
  if (!cache.accounts) cache.accounts = [];
  cache.accounts = Array.from(new Set([...cache.accounts, accountID]));

  await saveMetaCache(cache);
}

export async function clearMetaActiveAccount(accountID: string) {
  const cache = await loadMetaCache();
  delete cache.activeAccountID;
  cache.accounts = cache.accounts?.filter((id) => id !== accountID);

  await saveMetaCache(cache);
}
