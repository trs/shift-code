import fetch, { RequestInit, Response } from 'node-fetch';
import { CookieJar } from 'tough-cookie';

import createDebugger from 'debug';
const debug = createDebugger('fetch');

const DEFAULT_RETRY_INTERVAL = 30 * 1000;

function sleep(time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function request(jar: CookieJar | null, url: string, init: RequestInit = {}): Promise<Response> {
  if (jar) {
    init.headers = {
      ...(init.headers ?? {}),
      cookie: await jar.getCookieString(url)
    };
  }

  const response = await fetch(url, init);

  if (jar) {
    const setCookies = response.headers.raw()['set-cookie'] ?? [];
    for (const cookieString of setCookies) {
      jar.setCookie(cookieString, url);
    }
  }

  if (response.status === 429) { // Too Many Requests
    const retryAfterHeader = response.headers.get('retry-after');
    const delay = retryAfterHeader ? parseInt(retryAfterHeader) : DEFAULT_RETRY_INTERVAL;

    debug(`Too Many Requests: ${url}`);
    debug(`Delay: ${delay}ms`)

    await sleep(delay);
    return await request(jar, url, init);
  }

  return response;
}
