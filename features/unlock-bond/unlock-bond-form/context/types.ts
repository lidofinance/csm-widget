import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

export type UnlockBondFormInputType = {
  amount?: bigint;
};

export type UnlockBondFormNetworkData = {
  nodeOperatorId: NodeOperatorId;
  lockedBond: bigint;
  ethBalance: bigint;
};
