
import { CookieJar, Cookie } from 'tough-cookie';
import { SHIFT_URL } from './const';
import { Session } from './types';

export function extractSetCookie(setCookieString: string | string[], key: string) {
  if (!Array.isArray(setCookieString)) setCookieString = [setCookieString];

  for (const cookieString of setCookieString) {
    const cookie = Cookie.parse(cookieString);
    if (cookie?.key === key) return cookie;
  }
  return null;
}

export function createSessionCookieJar(session: Omit<Session, 'token'>) {
  const jar = new CookieJar();
  jar.setCookieSync(`si=${session.si}`, SHIFT_URL);
  jar.setCookieSync(`_session_id=${session.sessionID}`, SHIFT_URL);
  return jar;
}
