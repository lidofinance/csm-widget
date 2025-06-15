import { NodeOperatorInfo } from '@lidofinance/lido-csm-sdk';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { KeyWithStatus } from 'shared/hooks';
import { LoadingRecord } from 'types';

export type TransferKeysFormInputType = {
  count: number;
};

export type TransferKeysFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  keys?: KeyWithStatus[];
  info?: NodeOperatorInfo;
  keysToMigrate?: number;
  loading: LoadingRecord<'keys' | 'info' | 'keysToMigrate'>;
};
