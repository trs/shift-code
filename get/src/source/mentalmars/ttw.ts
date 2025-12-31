import * as cheerio from 'cheerio';

import { ShiftCode } from '../../types';
import { fetchWithRetry } from '../../utils/fetchWithRetry';
import { parseTableRow } from './shared';

const SHIFT_CODES_URL = 'https://mentalmars.com/game-news/tiny-tinas-wonderlands-shift-codes/';

export async function * getMentalMarsTTWShiftCodes(): AsyncGenerator<ShiftCode> {
  const response = await fetchWithRetry(SHIFT_CODES_URL);

  const text = await response.text();
  const $ = cheerio.load(text);

  yield * getHeadingShiftCodes($, 'h-2026-shift-codes');
  yield * getHeadingShiftCodes($, 'h-2025-shift-codes');
  yield * getHeadingShiftCodes($, 'h-2024-shift-codes');
  yield * getHeadingShiftCodes($, 'h-permanent-ttwl-shift-codes');
}

export async function * getHeadingShiftCodes($: cheerio.Root, heading: string, platform: string = 'Universal'): AsyncGenerator<ShiftCode> {
  const figure = $(`#${heading} ~ figure`).first();

  const parseRow = parseTableRow($, 'Tiny Tina\'s Wonderlands', platform);

  const rows = figure.find('tbody tr');
  for (const row of rows) {
    const code = parseRow(row);
    if (code) yield code;
  }
}
