import {createInterface} from 'readline';

export const prompt = <T>(value: T | undefined, text: string) => new Promise((resolve) => {
  if (value !== undefined) return resolve(value);

  const input = createInterface(process.stdin);
  input.question(text, resolve);
});
