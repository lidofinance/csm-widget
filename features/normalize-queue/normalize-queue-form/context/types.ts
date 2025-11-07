import { NodeOperatorId, NodeOperatorInfo } from '@lidofinance/lido-csm-sdk';

export type NormalizeQueueFormInputType = Record<string, never>;

export type NormalizeQueueFormNetworkData = {
  nodeOperatorId: NodeOperatorId;
  info: NodeOperatorInfo;
  unqueuedCount: number;
  ethBalance: bigint;
};
