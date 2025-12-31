import * as cheerio from 'cheerio';

import { SHIFT_CODE_REGEX } from "../../const";
import { ShiftCode } from "../../types";
import { parseDate } from "../../utils/parseDate";

export const parseTableRow = ($: cheerio.Root, game: string, platform: string) => (row: cheerio.Element): ShiftCode | null => {
  const cells = $(row).find('td');

  let reward: string = 'Unknown';
  let expired: string | undefined;
  let code: string | undefined;

  if (cells.length === 3) {
    reward = $(cells.get(0)).text();
    expired = $(cells.get(1)).text().replace('Expires:', '').trim();
    code = $(cells.get(2)).find('code').text().match(SHIFT_CODE_REGEX)?.[0];
  } else if (cells.length === 2) {
    reward = $(cells.get(0)).text();
    code = $(cells.get(1)).find('code').text().match(SHIFT_CODE_REGEX)?.[0];
  }

  if (!code) return null;

  const shiftCode: ShiftCode = {
    code,
    game,
    platform,
    reward,
    expired: expired ? parseDate(expired) : undefined
  };

  return shiftCode;
}
