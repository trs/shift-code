import { URL } from 'url';
import * as cheerio from 'cheerio';

import * as fetch from '../fetch';
import { extractSetCookie } from '../cookie';
import { SHIFT_URL } from '../const';
import { Authenticity } from '../types';

import createDebugger from 'debug';
const debug = createDebugger('session');

export async function authenticity(): Promise<Authenticity> {
  debug('Requesting session');

  const url = new URL('/', SHIFT_URL);
  const response = await fetch.request(null, url.href);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const text = await response.text();
  const $ = cheerio.load(text);

  // Get authenticity token from head
  const token = $('meta[name=csrf-token]').attr('content');
  if (!token) throw new Error('Token content not found');

  debug(`Session token: ${token}`);

  const sessionCookie = extractSetCookie(response.headers.raw()['set-cookie'], '_session_id');
  if (!sessionCookie) throw new Error('No session ID cookie set');

  debug(`Session ID: ${sessionCookie.value}`);

  return {
    token,
    sessionID: sessionCookie.value
  };
}
