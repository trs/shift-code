import { URL, URLSearchParams } from "url";
import * as cheerio from 'cheerio';
import { CookieJar } from "tough-cookie";

import * as fetch from '../fetch';
import { createSessionCookieJar } from "../cookie";
import { SHIFT_URL, GAME_CODE, SHIFT_TITLE, SERVICE_CODE, SHIFT_SERVICE } from "../const";
import { Session, RedemptionOption, RedemptionResult, ErrorCodes, RedeemFilter, ShiftService, ShiftTitle } from "../types";

import createDebugger from 'debug';
const debug = createDebugger('redeem');

export async function getRedemptionOptions(token: string, jar: CookieJar, code: string): Promise<[ErrorCodes, string | RedemptionOption[]]> {
  debug('Fetching redemption options');

  const url = new URL('/entitlement_offer_codes', SHIFT_URL);
  url.searchParams.set('code', code);

  const response = await fetch.request(jar, url.href, {
    redirect: "manual",
    headers: {
      'x-csrt-token': token,
      'x-requested-with': 'XMLHttpRequest'
    }
  });

  debug('Redemption options response', response.status, response.statusText);

  if (!response.ok) {
    if (response.status === 302) {
      return [ErrorCodes.LoginRequired, 'Login required'];
    }
    return [ErrorCodes.Unknown, response.statusText];
  }

  const text = await response.text();
  const $ = cheerio.load(text);

  const redeemOptions = $('.new_archway_code_redemption');
  if (redeemOptions.length === 0) {
    const error = text.trim();
    return [ErrorCodes.NoRedemptionOptions, error];
  }

  const options: RedemptionOption[] = [];

  redeemOptions.each((i, element) => {
    const token = $(element).find('input[name=authenticity_token]').val();
    const code = $(element).find('#archway_code_redemption_code').val();
    const check = $(element).find('#archway_code_redemption_check').val();
    const service = $(element).find('#archway_code_redemption_service').val() as ShiftService;
    const title = $(element).find('#archway_code_redemption_title').val() as ShiftTitle;

    options.push({
      token,
      code,
      check,
      service,
      title
    });
  });

  debug('Redemption options', options);

  return [ErrorCodes.Success, options];
}

export async function submitRedemption(jar: CookieJar, option: RedemptionOption): Promise<string> {
  debug('Submitting redemption', option);

  const url = new URL('/code_redemptions', SHIFT_URL);

  const params = new URLSearchParams();
  params.set('authenticity_token', option.token);
  params.set('archway_code_redemption[code]', option.code);
  params.set('archway_code_redemption[check]', option.check);
  params.set('archway_code_redemption[service]', option.service);
  params.set('archway_code_redemption[title]', option.title);

  const response = await fetch.request(jar, url.href, {
    method: 'POST',
    body: params,
    redirect: "manual",
  });

  debug('Redemption submission response', response.status, response.statusText);

  if (response.status !== 302) {
    throw new Error(response.statusText);
  }

  const statusUrl = new URL(response.headers.get('location') as string);

  // Invalid redirect, continue with redirect and get error message
  if (!statusUrl.pathname.startsWith('/code_redemptions')) {
    debug('Invalid redemption submission redirect', statusUrl.pathname);

    const errorResponse = await fetch.request(jar, statusUrl.href, {
      method: 'GET',
      headers: {
        'cookie': await jar.getCookieString(SHIFT_URL)
      }
    });

    const text = await errorResponse.text();
    const $ = cheerio.load(text);
    const notice = $('.alert.notice');
    const status = notice.text().trim() || 'Invalid redemption option result';
    throw new Error(status);
  }

  return statusUrl.href;
}

export async function waitForRedemption(jar: CookieJar, url: string): Promise<string> {
  debug(`Waiting for redemption: ${url}`);

  const response = await fetch.request(jar, url, {
    redirect: 'manual',
    headers: {
      'cookie': await jar.getCookieString(SHIFT_URL)
    }
  });

  if (response.status === 302) {
    const checkUrl = response.headers.get('location') as string;
    return checkUrl;
  }

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const text = await response.text();
  const $ = cheerio.load(text);

  const status = $('#check_redemption_status');
  const statusPath = status.attr('data-url');
  if (!statusPath) {
    throw new Error('Invalid redemption status');
  }

  const statusUrl = statusPath ? new URL(statusPath, SHIFT_URL).href : url;

  return await waitForRedemption(jar, statusUrl);
}

export async function checkRedemptionStatus(jar: CookieJar, url: string) {
  debug('Getting redemption status');

  const response = await fetch.request(jar, url, {
    headers: {
      'cookie': await jar.getCookieString(SHIFT_URL)
    }
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const text = await response.text();
  const $ = cheerio.load(text);

  const notice = $('.notice:not(#cookie-banner)');
  const status = notice.text().trim();

  debug('Redemption status:', status);

  return status;
}

export async function redeemOption(jar: CookieJar, option: RedemptionOption) {
  try {
    const statusUrl = await submitRedemption(jar, option);
    const checkUrl = await waitForRedemption(jar, statusUrl);
    const status = await checkRedemptionStatus(jar, checkUrl);

    const error = (() => {
      if (/Your code was successfully redeemed/i.test(status)) return ErrorCodes.Success;
      else if (/Failed to redeem your SHiFT code/i.test(status)) return ErrorCodes.AlreadyRedeemed;
      else if (/Too Many Requests/i.test(status)) return ErrorCodes.RateLimited;
      else return ErrorCodes.Unknown;
    })();

    const result: RedemptionResult = {
      code: option.code,
      title: GAME_CODE[SHIFT_TITLE.indexOf(option.title)],
      service: SERVICE_CODE[SHIFT_SERVICE.indexOf(option.service)],
      status,
      error
    };

    debug('Redemption result', result);

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.includes("please launch a SHiFT-enabled title first")) {
      return {
        code: option.code,
        error: ErrorCodes.LaunchGame,
        status: message
      }
    } else if (message.includes("Invalid redemption option result")) {
      return {
        code: option.code,
        error: ErrorCodes.LoginRequired,
        status: message
      }
    } else {
      return {
        code: option.code,
        error: ErrorCodes.Unknown,
        status: message
      }
    }
  }
}

export async function* redeem(session: Session, code: string, filter?: RedeemFilter): AsyncGenerator<RedemptionResult> {
  const jar = createSessionCookieJar(session);

  const [error, status] = await getRedemptionOptions(session.token, jar, code);
  if (error !== ErrorCodes.Success) {
    yield {
      code,
      error,
      status: status as string
    };
    return;
  }

  const options = status as RedemptionOption[];
  for await (const option of options) {
    const platform = SERVICE_CODE[SHIFT_SERVICE.indexOf(option.service)];
    const game = GAME_CODE[SHIFT_TITLE.indexOf(option.title)];

    if (filter?.platform?.length && !filter.platform.includes(platform)) {
      yield {
        code,
        status: 'Filtered out by platform',
        error: ErrorCodes.SkippedDueToFilter,
        service: platform,
        title: game
      }
    }

    if (filter?.game?.length && !filter.game.includes(game)) {
      yield {
        code,
        status: 'Filtered out by game',
        error: ErrorCodes.SkippedDueToFilter,
        service: platform,
        title: game
      }
    }

    const result = await redeemOption(jar, option);
    yield result;
  }
}
