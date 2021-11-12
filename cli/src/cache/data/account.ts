import { Account, Session } from "@shift-code/api";
import { loadContents, ACCOUNT_CACHE, storeContents, storeExists } from "../store";

export type AccountCache = {
  account?: Account;
  session?: Session;
  codes?: string[]
}

export async function accountCacheExists(accountID: string) {
  const exists = await storeExists(ACCOUNT_CACHE, accountID);
  return exists;
}

export async function loadAccountCache(accountID: string) {
  const cache = await loadContents<AccountCache>(ACCOUNT_CACHE, accountID, {});
  return cache;
}

export async function saveAccountCache(accountID: string, data: Partial<AccountCache>) {
  await storeContents(ACCOUNT_CACHE, accountID, data);
}

export async function saveAccountSession(accountID: string, session: Session) {
  const cache = await loadAccountCache(accountID);

  await saveAccountCache(accountID, {
    ...cache,
    session
  });
}

export async function saveAccount(accountID: string, account: Account) {
  const cache = await loadAccountCache(accountID);

  await saveAccountCache(accountID, {
    ...cache,
    account
  });
}

export async function clearAccountSession(accountID: string) {
  const cache = await loadAccountCache(accountID);

  delete cache?.session;

  await saveAccountCache(accountID, cache);
}

export async function saveCodeCache(accountID: string, codes: string[]) {
  const cache = await loadAccountCache(accountID);

  await saveAccountCache(accountID, {
    ...cache,
    codes
  });
}

export async function appendCodeCache(accountID: string, code: string) {
  const cache = await loadAccountCache(accountID);
  if (!cache.codes) cache.codes = [];
  cache.codes.push(code);

  await saveAccountCache(accountID, cache);
}

export async function clearCodeCache(accountID: string) {
  const cache = await loadAccountCache(accountID);
  delete cache?.codes;

  await saveAccountCache(accountID, cache);
}
