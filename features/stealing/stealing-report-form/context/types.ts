import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

export type StealingReportFormInputType = {
  amount?: bigint;
  nodeOperatorId?: NodeOperatorId;
  details?: string;
  penaltyType?: string;
};

export type StealingReportFormNetworkData = {
  ethBalance: bigint;
  nodeOperatorsCount: bigint;
};
