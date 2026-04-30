import type { PenaltyRecord } from '@lidofinance/lido-csm-sdk';
import type { Hex } from 'viem';

export type EnrichedPenalty = {
  transactionHash: Hex;
  type: PenaltyRecord['type'];
  typeLabel: string;
  timestamp: number;
  additionalFine?: bigint;
  amount?: bigint;
  details?: string;
};
