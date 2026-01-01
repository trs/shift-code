#!/usr/bin/env node

import yargs from 'yargs';
import { Arguments } from 'yargs';
import { migrateOldCache } from './cache/migrate';

import { loginCommand, logoutCommand, redeemCommand, cacheClearCommand, accountCommand, cacheRemoveCommand } from './commands';
import { GameName, PlatformName } from './names';

const runCommand = <T>(fn: (args: Arguments<T>) => Promise<any>) => (args: Arguments<T>) => {
  fn(args)
    .catch((err) => {
      console.log(err);
    });
};

void async function () {
  await migrateOldCache();

  yargs
    .command({
      command: 'login',
      describe: 'Login to a new account',
      handler: runCommand(loginCommand),
      builder: {
        email: {
          alias: 'e'
        },
        password: {
          alias: 'p'
        }
      }
    })
    .command({
      command: 'logout',
      describe: 'Logout of current account, or specified account',
      handler: runCommand(logoutCommand),
      builder: {
        email: {
          alias: 'e'
        }
      }
    })
    .command({
      command: 'accounts',
      describe: 'Show all accounts, marking the currently active account',
      handler: runCommand(accountCommand)
    })
    .command({
      command: 'cache <command>',
      describe: 'Manage cached Shift codes',
      handler: () => {},
      builder: (yargs) => yargs
        .command({
          command: 'clear',
          describe: 'Clear code cache for current account, or specified account',
          handler: runCommand(cacheClearCommand),
        })
        .command({
          command: 'rm [code]',
          describe: 'Remove a code from the cache for current account, or specified account',
          handler: runCommand(cacheRemoveCommand),
        })
    })
    .command({
      command: 'redeem [codes...]',
      describe: 'Redeem all available codes or the given codes if provided',
      handler: runCommand(redeemCommand),
      builder: {
        game: {
          alias: 'g',
          array: true,
          choices: Object.keys(GameName)
        },
        platform: {
          alias: 'p',
          array: true,
          choices: Object.keys(PlatformName)
        },
        file: {
          alias: 'f',
          type: 'string',
          description: 'Path to a file containing codes to redeem'
        }
      }
    })
    .help()
    .version()
    .demandCommand()
    .strict()
    .argv;
}();
