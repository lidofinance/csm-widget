import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

export type DelayedPenaltyCancelFormInputType = {
  amount?: bigint;
  nodeOperatorId?: NodeOperatorId;
  maxAmount?: bigint;
};

export type DelayedPenaltyCancelFormNetworkData = {
  ethBalance: bigint;
  nodeOperatorsCount: bigint;
};
