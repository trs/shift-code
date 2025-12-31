import * as cheerio from 'cheerio';

import { ShiftCode } from '../../types';
import { SHIFT_CODE_REGEX } from '../../const';
import { fetchWithRetry } from '../../utils/fetchWithRetry';
import { parseDate } from '../../utils/parseDate';
import { parseTableRow } from './shared';

const SHIFT_CODES_URL = 'https://mentalmars.com/game-news/new-tales-from-the-borderlands-shift-codes/';

export async function * getMentalMarsNTBShiftCodes(): AsyncGenerator<ShiftCode> {
  const response = await fetchWithRetry(SHIFT_CODES_URL);

  const text = await response.text();
  const $ = cheerio.load(text);

  const figure = $('figure').first();

  const parseRow = parseTableRow($, 'New Tales of the Borderlands', 'Universal');

  const rows = figure.find('tbody tr');
  for (const row of rows) {
    const code = parseRow(row);
    if (code) yield code;
  }
}
