import { URL } from 'url';

import * as fetch from '../fetch';
import { createSessionCookieJar } from '../cookie';
import { SHIFT_URL } from '../const';
import { Session } from '../types';

import createDebugger from 'debug';
const debug = createDebugger('logout');

export async function logout(session: Session) {
  debug('Attempting logout');

  const jar = createSessionCookieJar(session);

  const url = new URL('/logout', SHIFT_URL);
  const response = await fetch.request(jar, url.href, {
    redirect: "manual",
    // headers: {
    //   'x-csrt-token': session.token,
    //   'x-requested-with': 'XMLHttpRequest'
    // }
  });

  debug('Logout response', response.status, response.statusText);

  if (response.status === 302) {
    const location = response.headers.get('location') || '';

    if (location.endsWith('/home')) {
      return;
    }
  }

  throw new Error(response.statusText);
}
