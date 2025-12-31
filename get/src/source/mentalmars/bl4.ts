import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

import { ShiftCode } from '../../types';
import { parseTableRow } from './shared';

const SHIFT_CODES_URL = 'https://mentalmars.com/game-news/borderlands-4-shift-codes/';

export async function * getMentalMarsBL4ShiftCodes(): AsyncGenerator<ShiftCode> {
  const response = await fetch(SHIFT_CODES_URL);

  const text = await response.text();
  const $ = cheerio.load(text);

  const figure = $('#h-every-borderlands-4-shift-code-for-golden-keys ~ figure').first();

  const parseRow = parseTableRow($, 'Borderlands 4', 'Universal');

  const rows = figure.find('tbody tr');
  for (const row of rows) {
    const code = parseRow(row);
    if (code) yield code;
  }
}
