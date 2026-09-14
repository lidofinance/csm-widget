import { CURATED_GATES } from '@lidofinance/lido-csm-sdk';
import { CuratedGateEligibility } from 'modules/web3';
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
  availableGates: CuratedGateEligibility[];
  isPaused: boolean;
};
