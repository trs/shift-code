import { ShiftCode } from "../../types";
import { getMentalMarsBL1ShiftCodes } from "./bl1";
import { getMentalMarsBL2ShiftCodes } from "./bl2";
import { getMentalMarsBL3ShiftCodes } from "./bl3";
import { getMentalMarsBL4ShiftCodes } from "./bl4";
import { getMentalMarsTTWShiftCodes } from "./ttw";
import { getMentalMarsTPSShiftCodes } from "./tps";
import { getMentalMarsNTBShiftCodes } from "./ntb";
import { getMentalMarsGodfallShiftCodes } from "./godfall";

export async function * getMentalMarsShiftCodes(): AsyncGenerator<ShiftCode> {
  yield* getMentalMarsBL4ShiftCodes();
  yield* getMentalMarsBL3ShiftCodes();
  yield* getMentalMarsBL2ShiftCodes();
  yield* getMentalMarsBL1ShiftCodes();
  yield* getMentalMarsTTWShiftCodes();
  yield* getMentalMarsTPSShiftCodes();
  yield* getMentalMarsNTBShiftCodes();
  yield* getMentalMarsGodfallShiftCodes();
}
