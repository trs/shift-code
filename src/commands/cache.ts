import { Signale } from 'signale';

import { storeContents, CACHE_FILE } from '../store';


export async function cacheCommand() {
  const log = new Signale({interactive: true});

  log.await('Clearing cache...');

  await storeContents(CACHE_FILE, []);

  log.success('Cache cleared');
}
