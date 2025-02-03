export type InfraStatus =
  | 'Synced'
  | 'Installed'
  | 'Syncing'
  | 'Not allowed'
  | 'Not installed';

export type AllowedRelay = {
  Description: string;
  IsMandatory: boolean;
  Operator: string;
  Uri: string;
};

export type WarnedValidator = { index: string; pubkey: string };
