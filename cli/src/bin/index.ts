#!/usr/bin/env node

import {version} from '../../package.json';

import {Command} from 'commander';

import {accountCommand} from './account';
import {redeemCommand} from './redeem';

void async function () {
  const program = new Command();
  program
    .name('shift-code')
    .version(version);

  program.addCommand(accountCommand(program));
  program.addCommand(redeemCommand(program));

  await program.parseAsync(process.argv);
}();
