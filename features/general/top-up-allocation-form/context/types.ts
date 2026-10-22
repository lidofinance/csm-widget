import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

export type TopUpAllocationFormInputType = {
  enabled: boolean;
};

export type TopUpAllocationFormNetworkData = {
  nodeOperatorId: NodeOperatorId;
  enabled: boolean;
};
