import { Arguments } from 'yargs';
import { account, login } from '@shift-code/api';
import chalk from 'chalk';

import { tryPromptArgs } from '../shared';
import { saveAccountSession, saveMetaActiveAccount, saveAccount, loadAccountCache, loadMetaCache, saveMetaAccount } from '../cache';

export interface LoginParameters {
  email?: string;
  password?: string;
}

export async function loginCommand(args: Arguments<LoginParameters>) {
  const tryPrompt = tryPromptArgs(args);

  const cache = await loadMetaCache();

  const email = await tryPrompt({
    name: 'email',
    type: 'text',
    message: 'SHiFT email',
    validate: (value) => !!value
  });

  // If user is already saved, switch to it without requiring another login
  for (const accountID of cache.accounts ?? []) {
    const existingAccount = await loadAccountCache(accountID);
    if (existingAccount.account?.email === email && existingAccount.session) {
      const user = await account(existingAccount.session)
        .catch(() => null);

      if (user) {
        await saveMetaActiveAccount(user.id);
        await saveAccount(user.id, user);

        console.log('Changed active account');
        console.info(`  Name:   ${user.name}`);
        console.info(`  Email:  ${user.email}`);

        return;
      }
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

  await saveMetaActiveAccount(user.id);
  await saveMetaAccount(user.id);
  await saveAccountSession(user.id, session);
  await saveAccount(user.id, user);

  console.log(chalk.green('Login successful'));
}
