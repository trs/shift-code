import chalk from 'chalk';
import { table, getBorderCharacters } from 'table';

import { loadMetaCache, loadAccountCache } from '../cache';

export async function accountCommand() {
  const cache = await loadMetaCache();
  if (!cache.accounts?.length) {
    console.error('No saved accounts, login to add one.');
    console.info('$ shift-code login');
    return;
  }

  const list: string[][] = [
    [
      chalk.bold('Name'),
      chalk.bold('Email'),
      chalk.bold('Active')
    ]
  ];
  for (const accountID of cache.accounts) {
    try {
      const user = await loadAccountCache(accountID);
      if (!user.account) continue;

      const isActiveAccount = typeof cache.activeAccountID === 'string'
        && cache.activeAccountID === user.account?.id;

      list.push([
        user.account?.name,
        user.account?.email,
        isActiveAccount ? chalk.green('Y') : ''
      ]);
    } catch {}
  }

  console.log(table(list, {
    header: {
      alignment: 'left',
      content: 'Saved accounts'
    },
    border: getBorderCharacters('norc')
  }));
}
