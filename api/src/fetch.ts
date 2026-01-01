import fetch, { RequestInit, Response } from 'node-fetch';
import { CookieJar } from 'tough-cookie';

import createDebugger from 'debug';
const debug = createDebugger('fetch');

const DEFAULT_RETRY_INTERVAL = 10 * 1000;
const DEFAULT_MAX_RETRIES = 3;

function sleep(time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function request(
  jar: CookieJar | null,
  url: string,
  init: RequestInit = {},
  options: {
    maxRetries: number;
    retryCount: number;
  } = {
    maxRetries: DEFAULT_MAX_RETRIES,
    retryCount: 0
  },
): Promise<Response> {
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
    if (options.retryCount >= options.maxRetries) {
      debug(`Too Many Requests: ${url} - Max retries (${options.maxRetries}) exceeded`);
      return response;
    }

    const retryAfterHeader = response.headers.get('retry-after');
    const delay = retryAfterHeader ? parseInt(retryAfterHeader) : DEFAULT_RETRY_INTERVAL * Math.pow(2, options.retryCount);

    debug(`Too Many Requests: ${url}`);
    debug(`Delay: ${delay}ms`);
    debug(`Retry attempt: ${options.retryCount + 1}/${options.maxRetries}`);

    await sleep(delay);
    return await request(jar, url, init, {
      maxRetries: options.maxRetries,
      retryCount: options.retryCount + 1
    });
  }

  return response;
}
