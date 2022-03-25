import { GAME_CODE, SERVICE_CODE, SHIFT_SERVICE, SHIFT_TITLE } from "./const";

export interface Authenticity {
  token: string;
  sessionID: string;
}

export interface Session extends Authenticity {
  si: string;
}

export interface Account {
  email: string;
  name: string;
  id: string;
}

export type ShiftService = typeof SHIFT_SERVICE[number];

export type ShiftTitle = typeof SHIFT_TITLE[number];

export type ServiceCode = typeof SERVICE_CODE[number];

export type GameCode = typeof GAME_CODE[number];

export interface RedemptionOption {
  token: string;
  code: string;
  check: string;
  service: ShiftService;
  title: ShiftTitle;
}

export interface RedemptionResult {
  code: string;
  status: string;
  error: ErrorCodes;
  title?: GameCode;
  service?: ServiceCode;
}

export interface RedeemFilter {
  platform?: Array<ServiceCode>;
  game?: Array<GameCode>;
}

export enum ErrorCodes {
  Success = 'Success',
  LoginRequired = 'LoginRequired',
  NoRedemptionOptions = 'NoRedemptionOptions',
  CodeNotAvailable = 'CodeNotAvailable',
  LaunchGame = 'LaunchGame',
  AlreadyRedeemed = 'AlreadyRedeemed',
  SkippedDueToFilter = 'SkippedDueToFilter',
  Unknown = 'Unknown'
}
