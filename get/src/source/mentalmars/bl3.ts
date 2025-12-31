import * as cheerio from 'cheerio';

import { ShiftCode } from '../../types';
import { fetchWithRetry } from '../../utils/fetchWithRetry';
import { parseTableRow } from './shared';

const SHIFT_CODES_URL = 'https://mentalmars.com/game-news/borderlands-3-golden-keys/';

export async function * getMentalMarsBL3ShiftCodes(): AsyncGenerator<ShiftCode> {
  const response = await fetchWithRetry(SHIFT_CODES_URL);

  const text = await response.text();
  const $ = cheerio.load(text);

  yield * getHeadingShiftCodes($, 'h-2026-shift-codes');
  yield * getHeadingShiftCodes($, 'h-2025-shift-codes');
  yield * getHeadingShiftCodes($, 'h-2024-shift-codes');
  yield * getHeadingShiftCodes($, 'h-borderlands-3-cosmetic-shift-code-rewards');
  yield * getHeadingShiftCodes($, 'h-borderlands-3-diamond-key-shift-codes');
  yield * getHeadingShiftCodes($, 'h-borderlands-3-permanent-shift-keys');
}

export async function * getHeadingShiftCodes($: cheerio.Root, heading: string, platform: string = 'Universal'): AsyncGenerator<ShiftCode> {
  const figure = $(`#${heading} ~ figure`).first();

  const parseRow = parseTableRow($, 'Borderlands 3', platform);

  const rows = figure.find('tbody tr');
  for (const row of rows) {
    const code = parseRow(row);
    if (code) yield code;
  }
}
