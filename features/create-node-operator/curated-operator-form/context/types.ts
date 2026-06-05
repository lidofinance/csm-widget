import { CURATED_GATES, GateItemEligibility } from '@lidofinance/lido-csm-sdk';
import type { Address } from 'viem';

export type CuratedOperatorFormInputType = {
  step: number;
  gateName?: CURATED_GATES;
  rewardAddress?: Address;
  managerAddress?: Address;
  name: string;
  description: string;
};

export type CuratedOperatorFormNetworkData = {
  ethBalance: bigint;
  address: Address;
  availableGates: GateItemEligibility[];
  isPaused: boolean;
};
