export const INFRA_STATUS = {
  SYNCED: 'SYNCED',
  SYNCING: 'SYNCING',
  NOT_ALLOWED: 'NOT_ALLOWED',
  NOT_INSTALLED: 'NOT_INSTALLED',
  INSTALLED: 'INSTALLED',
} as const;

export type INFRA_STATUS = keyof typeof INFRA_STATUS;

export type AllowedRelay = {
  Description: string;
  IsMandatory: boolean;
  Operator: string;
  Uri: string;
};

export type WarnedValidator = { index: string; pubkey: string };
