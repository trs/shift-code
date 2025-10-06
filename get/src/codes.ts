import { getOrcicornShiftCodes } from './source/orcicorn';
import { getCodeVaultShiftCodes } from './source/codevault';

export async function * getShiftCodes() {
  yield * getCodeVaultShiftCodes();
  yield * getOrcicornShiftCodes();
}
