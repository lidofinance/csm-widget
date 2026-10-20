import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import type { Hex } from 'viem';

export type DelayedPenaltyReportFormInputType = {
  amount?: bigint;
  nodeOperatorId?: NodeOperatorId;
  details?: string;
  penaltyType?: Hex;
};

export type DelayedPenaltyReportFormNetworkData = {
  ethBalance: bigint;
  nodeOperatorsCount: bigint;
};
