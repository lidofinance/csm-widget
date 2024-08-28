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

export type DepositDataV2 = DepositDataCommon & {
  network_name: string;
};

export type DepositDataV1 = DepositDataCommon & {
  eth2_network_name: string;
};

export type DepositData = DepositDataV2 | DepositDataV1;
