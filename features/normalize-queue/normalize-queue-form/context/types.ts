import { BigNumber } from 'ethers';
import { useNodeOperatorInfo } from 'shared/hooks';
import { LoadingRecord, NodeOperatorId } from 'types';

export type NormalizeQueueFormInputType = Record<string, never>;

export type NormalizeQueueFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  info?: ReturnType<typeof useNodeOperatorInfo>['data'];
  unqueuedCount?: number;
  etherBalance?: BigNumber;
  loading: LoadingRecord<'info' | 'etherBalance'>;
};
