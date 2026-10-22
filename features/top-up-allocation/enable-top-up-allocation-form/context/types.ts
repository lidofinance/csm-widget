import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

export type EnableTopUpAllocationFormInputType = {
  nodeOperatorId?: NodeOperatorId;
};

export type EnableTopUpAllocationFormNetworkData = {
  nodeOperatorsCount: bigint;
};
