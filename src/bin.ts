#!/usr/bin/env node

import yargs from 'yargs';
import { Arguments } from 'yargs';

import { loginCommand, redeemCommand } from './commands';

const runCommand = <T>(fn: (args: Arguments<T>) => Promise<any>) => (args: Arguments<T>) => {
  fn(args)
    .catch((err) => {
      console.log(err);
    });
};

yargs
  .command('login', 'Create a login session for redemption', (yarg) => {
    yarg.option('email', {alias: 'e'});
    yarg.option('password', {alias: 'p'});
  }, runCommand(loginCommand))
  .command('redeem', 'Redeem all available codes or the given codes if provided', (yarg) => {
    yarg.option('code', {alias: 'c', type: 'array'});
  }, runCommand(redeemCommand))
  .help()
  .argv;
