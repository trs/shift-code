import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

import { ShiftCode } from '../../types';
import { SHIFT_CODE_REGEX } from '../../const';
import { parseDate } from '../../utils/parseDate';

const SHIFT_CODES_URL = 'https://mentalmars.com/game-news/godfall-shift-codes/';

export async function * getMentalMarsGodfallShiftCodes(): AsyncGenerator<ShiftCode> {
  const response = await fetch(SHIFT_CODES_URL);

  const text = await response.text();
  const $ = cheerio.load(text);

  const figure = $('#h-new-godfall-shift-codes ~ figure').first();

  const rows = figure.find('tbody tr');
  for (const row of rows) {
    const cells = $(row).find('td');

    const reward = $(cells.get(0)).text();
    const created = $(cells.get(1)).text();
    const code = $(cells.get(2)).find('code').text().match(SHIFT_CODE_REGEX)?.[0];

    if (!code) continue;

    const shiftCode: ShiftCode = {
      code,
      game: 'Godfall',
      platform: 'Universal',
      reward,
      created: parseDate(created),
    };

    yield shiftCode;
  }
}
