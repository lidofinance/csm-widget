import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

export type StealingReportFormInputType = {
  amount?: bigint;
  nodeOperatorId?: NodeOperatorId;
  blockhash?: string;
};

export type StealingReportFormNetworkData = {
  ethBalance: bigint;
  nodeOperatorsCount: bigint;
};
