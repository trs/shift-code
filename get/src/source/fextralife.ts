import { ShiftCode } from "../types";
import { SHIFT_CODE_REGEX } from "../const";

const BL4_SHIFT_CODES_URL = 'https://borderlands4.wiki.fextralife.com/SHiFT+Code+Guide';

export async function * getFextralifeBL4ShiftCodes(): AsyncGenerator<ShiftCode> {
  const response = await fetch(BL4_SHIFT_CODES_URL);
  const text = await response.text();
  const codes = text.matchAll(SHIFT_CODE_REGEX);
  
  for (const [code] of codes) {
    yield {
      code,
      game: 'Borderlands 4',
      platform: 'Universal',
      reward: 'Unknown',
    };
  }
}

export async function * getFextralifeShiftCodes(): AsyncGenerator<ShiftCode> {
  yield * getFextralifeBL4ShiftCodes();
}