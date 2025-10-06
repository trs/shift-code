import { ShiftCode } from '../types';

import { parseDate } from '../utils/parseDate';

const BL4_SHIFT_CODES_URL = 'https://code-vault.celo.workers.dev/api/codes';

export async function* getCodeVaultBL4ShiftCodes(): AsyncGenerator<ShiftCode> {
  const response = await fetch(BL4_SHIFT_CODES_URL);
  const json = (await response.json()) as {
    data: { code: string; created_at: string }[];
  };

  for (const entry of json.data) {
    yield {
      code: entry.code,
      game: 'Borderlands 4',
      platform: 'Universal',
      reward: 'Unknown',
      created: parseDate(entry.created_at),
    };
  }
}

export async function* getCodeVaultShiftCodes(): AsyncGenerator<ShiftCode> {
  yield* getCodeVaultBL4ShiftCodes();
}
