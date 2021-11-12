import type { Account, Session } from '@shift-code/api';

export type JSONSession = {
  token: string;
  cookie: string;
}

export type MetaStore = {
  activeAccountID: string;
}

export type AccountStore = {
  account?: Account;
  session?: Session;
  codes?: string[]
}
