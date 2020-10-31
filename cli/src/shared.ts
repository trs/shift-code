import prompt from 'prompts';
import { PromptObject } from 'prompts';

export const tryPromptArgs = <T extends Record<string, any>>(args: T) => async <T extends string>(question: PromptObject<T>) => {
  const key = question.name as string;
  if (args[key]) return args[key] as string;
  const result = await prompt(question);
  return (result as any)[key] as string;
};
