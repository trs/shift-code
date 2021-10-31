import { Account, Session } from '@shift-code/api';
import { loadContents, storeContents, ACCOUNT_FILE, storeExists } from './store';

export type Cache = {
  activeAccountID?: string;
  accounts?: {
    [accountID: string]: {
      account?: Account;
      session?: Session;
      codes?: string[]
    }
  }
}

export async function cacheExists() {
  const exists = await storeExists(ACCOUNT_FILE);
  return exists;
}

export async function loadCache() {
  const cache = await loadContents<Cache>(ACCOUNT_FILE, {});
  return cache;
}

export async function saveActiveAccount(accountID: string) {
  const cache = await loadCache();
  cache.activeAccountID = accountID;

  await storeContents(ACCOUNT_FILE, cache);
}

export async function loadAccountSession() {
  const cache = await loadCache();
  if (!cache?.activeAccountID) return null;

  return cache?.accounts?.[cache.activeAccountID]?.session ?? null;
}

export async function loadAccount() {
  const cache = await loadCache();
  if (!cache?.activeAccountID) return null;

  return cache?.accounts?.[cache.activeAccountID]?.account ?? null;
}

export async function saveAccountSession(accountID: string, session: Session) {
  const cache = await loadCache();
  if (!cache.accounts) {
    cache.accounts = {};
  }

  cache.accounts[accountID] = {
    ...(cache?.accounts?.[accountID] ?? {}),
    session
  };

  await storeContents(ACCOUNT_FILE, cache);
}

export async function saveAccount(account: Account) {
  const cache = await loadCache();
  if (!cache.accounts) {
    cache.accounts = {};
  }

  cache.accounts[account.id] = {
    ...(cache?.accounts?.[account.id] ?? {}),
    account
  };

  await storeContents(ACCOUNT_FILE, cache);
}

export async function clearAccountSession() {
  const cache = await loadCache();
  if (!cache?.activeAccountID) return;

  delete cache?.accounts?.[cache.activeAccountID].session;
  delete cache?.activeAccountID;

  await storeContents(ACCOUNT_FILE, cache);
}

export async function loadCodeCache() {
  const cache = await loadCache();
  if (!cache?.activeAccountID) return;

  return cache?.accounts?.[cache.activeAccountID]?.codes ?? [];
}

export async function saveCodeCache(codes: string[]) {
  const cache = await loadCache();
  if (!cache?.activeAccountID) return;
  if (!cache.accounts) {
    cache.accounts = {};
  }

  if (!cache.accounts[cache.activeAccountID]?.codes) {
    cache.accounts[cache.activeAccountID].codes = [];
  }
  cache.accounts[cache.activeAccountID].codes = codes;

  await storeContents(ACCOUNT_FILE, cache);
}

export async function appendCodeCache(code: string) {
  const cache = await loadCache();
  if (!cache?.activeAccountID) return;
  if (!cache.accounts) {
    cache.accounts = {};
  }

  if (!cache.accounts[cache.activeAccountID]?.codes) {
    cache.accounts[cache.activeAccountID].codes = [];
  }
  cache.accounts[cache.activeAccountID].codes?.push(code);

  await storeContents(ACCOUNT_FILE, cache);
}

export async function clearCodeCache() {
  const cache = await loadCache();
  if (!cache?.activeAccountID) return;

  delete cache?.accounts?.[cache.activeAccountID].codes;

  await storeContents(ACCOUNT_FILE, cache);
}
