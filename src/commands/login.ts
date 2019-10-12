import { Arguments } from 'yargs';
import prompt from 'prompts';
import { PromptObject } from 'prompts';
import { login } from 'shift-code-api';

import { storeContents, SESSION_FILE } from '../store';

export interface LoginParameters {
  email?: string;
  password?: string;
}

const tryPromptArgs = (args: Arguments<LoginParameters>) => async <T extends string>(question: PromptObject<T>) => {
  const key = question.name as string;
  if (args[key]) return args[key] as string;
  const result = await prompt(question);
  return (result as any)[key] as string;
};

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

  const session = await login({email, password});

  await storeContents(SESSION_FILE, JSON.stringify(session));

  console.log('Login successful!');

  return session;
}
