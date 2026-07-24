import { BondBalance, NodeOperatorId } from '@lidofinance/lido-csm-sdk';

export type UnlockBondFormInputType = Record<string, never>;

export type UnlockBondFormNetworkData = {
  nodeOperatorId: NodeOperatorId;
  bond: BondBalance;
  isExpired: boolean;
  compensationAmount: bigint;
};
