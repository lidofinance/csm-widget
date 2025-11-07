import {
  KeyWithStatus,
  NodeOperatorId,
  NodeOperatorInfo,
} from '@lidofinance/lido-csm-sdk';

export type TransferKeysFormInputType = {
  count: number;
};

export type TransferKeysFormNetworkData = {
  nodeOperatorId: NodeOperatorId;
  keys: KeyWithStatus[];
  info: NodeOperatorInfo;
  keysToMigrate: number;
  needCleanup: boolean;
};
