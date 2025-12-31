import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

import { ShiftCode } from '../../types';
import { parseTableRow } from './shared';

const SHIFT_CODES_URL = 'https://mentalmars.com/game-news/borderlands-golden-keys/';

export async function * getMentalMarsBL1ShiftCodes(): AsyncGenerator<ShiftCode> {
  const response = await fetch(SHIFT_CODES_URL);

  const text = await response.text();
  const $ = cheerio.load(text);

  yield * getHeadingShiftCodes($, 'h-2026-shift-codes');
  yield * getHeadingShiftCodes($, 'h-2025-shift-codes');
  yield * getHeadingShiftCodes($, 'h-2024-shift-codes');
  yield * getHeadingShiftCodes($, 'h-legacy-codes-that-work-in-2025');
}

export async function * getHeadingShiftCodes($: cheerio.Root, heading: string, platform: string = 'Universal'): AsyncGenerator<ShiftCode> {
  const figure = $(`#${heading} ~ figure`).first();

  const parseRow = parseTableRow($, 'Borderlands', platform);

  const rows = figure.find('tbody tr');
  for (const row of rows) {
    const code = parseRow(row);
    if (code) yield code;
  }
}
