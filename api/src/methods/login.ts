import { URL, URLSearchParams } from 'url';

import { authenticity } from './authenticity';
import { extractSetCookie } from '../cookie';
import * as fetch from '../fetch';
import { SHIFT_URL } from '../const';
import { Session, Authenticity } from '../types';

import createDebugger from 'debug';
const debug = createDebugger('login');

export interface LoginParameters {
  email: string;
  password: string;
}

export async function login({email, password}: LoginParameters, authentic?: Authenticity): Promise<Session> {
  const {token, sessionID} = authentic ? authentic : await authenticity();

  debug('Authenticating', email);

  const url = new URL('/sessions', SHIFT_URL);

  const params = new URLSearchParams();
  params.set('authenticity_token', token);
  params.set('user[email]', email);
  params.set('user[password]', password);

  const response = await fetch.request(null, url.href, {
    headers: {
      'cookie': `_session_id=${sessionID}`
    },
    redirect: 'manual',
    method: 'POST',
    body: params
  });

  debug('Authentication response', response.statusText, response.statusText);

  if (response.status !== 302) {
    throw new Error(response.statusText);
  }

  const location = response.headers.get('location');
  if (!location || !location.endsWith('/account')) {
    throw new Error('Authentication failed');
  }

  const siCookie = extractSetCookie(response.headers.raw()['set-cookie'], 'si');
  if (!siCookie) {
    throw new Error('No si token found');
  }

  debug('Authentication successful', siCookie.value);

  return {
    token,
    sessionID,
    si: siCookie.value
  };
}
