import { NodeOperatorId, NodeOperatorInfo } from '@lidofinance/lido-csm-sdk';
import { LoadingRecord } from 'types';

export type NormalizeQueueFormInputType = Record<string, never>;

export type NormalizeQueueFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  info?: NodeOperatorInfo;
  unqueuedCount?: number;
  ethBalance?: bigint;
  loading: LoadingRecord<'info' | 'ethBalance'>;
};
