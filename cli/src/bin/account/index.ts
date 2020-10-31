import commander from 'commander';
import { prompt } from '../../utils/prompt';

import {gamesCommand} from './games';

export function accountCommand(program: commander.Command) {
  const account = program.command('account');

  const login = account
    .command('login')
    .description(`Add a shift account with available games and platforms.

  Providing a platform option with no games will default to all games on that platform.
  Providing no options will default to all platforms with all games.

Available games:
  bl1  Borderlands 1
  bl2  Borderlands 2
  tps  Borderlands: The Pre-Sequel
  bl3  Borderlands 3`)
    .arguments('[email] [password]')
    .option('-s, --steam [games...]', 'Steam games')
    .option('-x, --xbox [games...]', 'Xbox games')
    .option('-p, --psn [games...]', 'Playstation games')
    .option('-e, --epic [games...]', 'Epic Store games')

    .action(async (email, password) => {
      const opts = login.opts();

      email = await prompt(email, 'Email: ');
      password = await prompt(password, 'Password: ');
    });

  const logout = account
    .command('logout')
    .arguments('[email]')
    .action(async (email) => {
      // If email provided, use it
      // Else use "current" email
    });

  const use = account
    .command('use')
    .arguments('<email>')
    .action((email) => {

    });

  account.addCommand(gamesCommand(account));

  return account;
}
