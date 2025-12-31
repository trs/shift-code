import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

import { ShiftCode } from '../../types';
import { parseTableRow } from './shared';

const SHIFT_CODES_URL = 'https://mentalmars.com/game-news/bltps-golden-keys/';

export async function * getMentalMarsTPSShiftCodes(): AsyncGenerator<ShiftCode> {
  const response = await fetch(SHIFT_CODES_URL);

  const text = await response.text();
  const $ = cheerio.load(text);

  yield * getHeadingShiftCodes($, 'h-2026-shift-codes');
  yield * getHeadingShiftCodes($, 'h-2025-shift-codes');
  yield * getHeadingShiftCodes($, 'h-2024-shift-codes');
  yield * getHeadingShiftCodes($, 'h-permanent-bltps-shift-codes-for-golden-keys');
  yield * getHeadingShiftCodes($, 'h-bltps-pc-shift-codes', 'Steam');
  yield * getHeadingShiftCodes($, 'h-bltps-playstation-shift-codes', 'Playstation');
  yield * getHeadingShiftCodes($, 'h-bltps-xbox-shift-codes', 'Xbox');
}

export async function * getHeadingShiftCodes($: cheerio.Root, heading: string, platform: string = 'Universal'): AsyncGenerator<ShiftCode> {
  const figure = $(`#${heading} ~ figure`).first();

  const parseRow = parseTableRow($, 'Borderlands: The Pre-Sequel', platform);

  const rows = figure.find('tbody tr');
  for (const row of rows) {
    const code = parseRow(row);
    if (code) yield code;
  }
}
