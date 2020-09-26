import { Account, Session } from "@shift-code/api";

export type CacheStore = string[];

export interface StoredSession {
  account: Account;
  session: Session;
  preferences: AccountPreferences;
}

export interface AccountPreferences {
  games: AccountGame[];
}

export interface AccountGame {
  name: string;
  platform: string;
}
