import { URL } from 'url';
import * as cheerio from 'cheerio';

import * as fetch from '../fetch';
import { SHIFT_URL } from '../const';
import { Session, Account } from '../types';

import createDebugger from 'debug';
import { createSessionCookieJar } from '../cookie';
const debug = createDebugger('account');

export async function account(session: Session) {
  debug('Requesting account');

  const jar = createSessionCookieJar(session);

  const url = new URL('/account', SHIFT_URL);
  const response = await fetch.request(jar, url.href, {
    redirect: 'manual',
    method: 'GET'
  });

  debug('Account response', response.status, response.statusText);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const text = await response.text();
  const $ = cheerio.load(text);

  const email = $('#current_email').text();
  const name = $('#current_display_name').text();
  const id = $('#current_shift_service_id').text();

  const account: Account = {
    email,
    name,
    id
  };

  debug('Account', account);
  return account;
}
