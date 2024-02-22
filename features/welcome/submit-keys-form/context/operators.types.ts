export type NodeOperatorFileKeyCommon = {
  pubkey: string;
  withdrawal_credentials: string;
  amount: number;
  signature: string;
  deposit_message_root: string;
  deposit_data_root: string;
  fork_version: string;
  deposit_cli_version: string;
};

export type NodeOperatorFileKey = NodeOperatorFileKeyCommon & {
  network_name: string;
};

export type NodeOperatorFileKeyOld = NodeOperatorFileKeyCommon & {
  eth2_network_name: string;
};
