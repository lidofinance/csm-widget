import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

export type DelayedPenaltyReportFormInputType = {
  amount?: bigint;
  nodeOperatorId?: NodeOperatorId;
  details?: string;
  penaltyType?: number;
};

export type DelayedPenaltyReportFormNetworkData = {
  ethBalance: bigint;
  nodeOperatorsCount: bigint;
};
