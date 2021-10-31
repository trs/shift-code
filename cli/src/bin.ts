#!/usr/bin/env node

import yargs from 'yargs';
import { Arguments } from 'yargs';
import { migrateOldCache } from './cache/migrate';

import { loginCommand, logoutCommand, redeemCommand, cacheCommand, accountCommand } from './commands';

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
          handler: runCommand(cacheCommand),
          builder: {
            email: {
              alias: 'e'
            }
          }
        })
    })
    .command({
      command: 'redeem [codes...]',
      describe: 'Redeem all available codes or the given codes if provided',
      handler: runCommand(redeemCommand),
    })
    .help()
    .version()
    .demandCommand()
    .strict()
    .argv;
}();
