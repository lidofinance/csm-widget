export type DepositDataCommon = {
  pubkey: string;
  withdrawal_credentials: string;
  amount: number;
  signature: string;
  deposit_message_root: string;
  deposit_data_root: string;
  fork_version: string;
  deposit_cli_version: string;
};

export type DepositData = DepositDataCommon & {
  network_name: string;
};

// TODO: support old format
export type DepositDataOld = DepositDataCommon & {
  eth2_network_name: string;
};

export type DepositDataAny = DepositData | DepositDataOld;
