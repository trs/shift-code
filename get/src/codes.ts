import { getOrcicornShiftCodes } from './source/orcicorn';
import { getFextralifeShiftCodes } from './source/fextralife';

export async function * getShiftCodes() {
  yield * getFextralifeShiftCodes();
  yield * getOrcicornShiftCodes();
}
