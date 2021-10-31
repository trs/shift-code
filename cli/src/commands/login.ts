import { Arguments } from 'yargs';
import { Signale } from 'signale';
import { account, login } from '@shift-code/api';

import { tryPromptArgs } from '../shared';
import { saveAccountSession, saveActiveAccount, saveAccount, loadCache } from '../cache';

export interface LoginParameters {
  email?: string;
  password?: string;
}

export async function loginCommand(args: Arguments<LoginParameters>) {
  const tryPrompt = tryPromptArgs(args);

  const log = new Signale();

  const cache = await loadCache();

  const email = await tryPrompt({
    name: 'email',
    type: 'text',
    message: 'SHiFT email',
    validate: (value) => !!value
  });

  // If user is already saved
  const existingAccount = Object.values(cache.accounts ?? {})
    .find((acc) => acc.account?.email === email);

  if (existingAccount && existingAccount.session) {
    const user = await account(existingAccount.session)
      .catch(() => null);

    if (user) {
      await saveActiveAccount(user.id);
      await saveAccount(user);

      log.success('Changed active account');
      log.info(`  Name:   ${user.name}`);
      log.info(`  Email:  ${user.email}`);

      return;
    }
  }

  const password = await tryPrompt({
    name: 'password',
    type: 'password',
    message: 'SHiFT password',
    validate: (value) => !!value
  });

  const session = await login({email, password});
  const user = await account(session);

  await saveActiveAccount(user.id);
  await saveAccountSession(user.id, session);
  await saveAccount(user);

  log.success('Login successful!');
}
