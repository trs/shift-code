import { getOrcicornShiftCodes } from './source/orcicorn';
import { getFextralifeShiftCodes } from './source/fextralife';
import { getCodeVaultShiftCodes } from './source/codevault';

export async function * getShiftCodes() {
  yield * getFextralifeShiftCodes();
  yield * getOrcicornShiftCodes();
  yield * getCodeVaultShiftCodes();
}
