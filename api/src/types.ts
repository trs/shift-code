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

export interface RedemptionOption {
  token: string;
  code: string;
  check: string;
  service: string;
  title: string;
}

export interface RedemptionResult {
  code: string;
  status: string;
  error: ErrorCodes;
  title?: string;
  service?: string;
}

export enum ErrorCodes {
  Success = 'Success',
  LoginRequired = 'LoginRequired',
  NoRedemptionOptions = 'NoRedemptionOptions',
  CodeNotAvailable = 'CodeNotAvailable',
  LaunchGame = 'LaunchGame',
  AlreadyRedeemed = 'AlreadyRedeemed',
  Unknown = 'Unknown'
}
