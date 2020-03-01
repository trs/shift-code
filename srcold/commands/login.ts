import { Arguments } from 'yargs';
import { Signale } from 'signale';
import { login } from 'shift-code-api';

import { tryPromptArgs } from '../shared';
import { storeContents, SESSION_FILE } from '../store';

export interface LoginParameters {
  email?: string;
  password?: string;
}

export async function loginCommand(args: Arguments<LoginParameters>) {
  const tryPrompt = tryPromptArgs(args);

  const email = await tryPrompt({
    name: 'email',
    type: 'text',
    message: 'SHiFT email',
    validate: (value) => !!value
  });

  const password = await tryPrompt({
    name: 'password',
    type: 'password',
    message: 'SHiFT password',
    validate: (value) => !!value
  });

  const session = await login(email, password);

  await storeContents(SESSION_FILE, session);

  const log = new Signale();
  log.success('Login successful!');

  return session;
}
