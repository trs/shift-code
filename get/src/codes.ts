import { getOrcicornShiftCodes } from './source/orcicorn';
import { getCodeVaultShiftCodes } from './source/codevault';
import { getMentalMarsShiftCodes } from './source/mentalmars';

export async function * getShiftCodes() {
  yield * getCodeVaultShiftCodes();
  yield * getMentalMarsShiftCodes();
  yield * getOrcicornShiftCodes();
}
