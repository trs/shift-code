import commander from 'commander';

import {gamesCommand} from './games';

export function accountCommand(program: commander.Command) {
  const account = program.command('account');

  const login = account
    .command('login')
    .description(`Add a shift account with available games and platforms.
If no games are specified, it will attempt to redeem all.

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

    .action((email, password) => {
      const opts = login.opts();

    });

  const logout = account
    .command('logout')
    .arguments('[email]')
    .action(() => {
      console.log('logout')
    });

  account.addCommand(gamesCommand(account));

  return account;
}
