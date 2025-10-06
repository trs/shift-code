import fetch from 'node-fetch';
const Pick = require('stream-json/filters/Pick');
const {streamValues} = require('stream-json/streamers/StreamValues');

import { ShiftCode } from '../types';
import { parseDate } from '../utils/parseDate';

const SHIFT_CODES_URL = 'https://shift.orcicorn.com/shift-code/index.json';

export async function * getOrcicornShiftCodes(): AsyncGenerator<ShiftCode> {
  const response = await fetch(SHIFT_CODES_URL);

  const stream = response.body!
    .pipe(Pick.withParser({filter: /^0.codes.\d+/}))
    .pipe(streamValues());

  for await (const {value} of stream) {
    const created = parseDate(value.archived);
    const expired = parseDate(value.expires);

    const code: ShiftCode = {
      code: value.code,
      game: value.game,
      platform: value.platform,
      reward: value.reward,
      created,
      expired
    }

    yield code;
  }
}
