import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

export type StealingCancelFormInputType = {
  amount?: bigint;
  nodeOperatorId?: NodeOperatorId;
  maxAmount?: bigint;
};

export type StealingCancelFormNetworkData = {
  ethBalance: bigint;
  nodeOperatorsCount: bigint;
};
