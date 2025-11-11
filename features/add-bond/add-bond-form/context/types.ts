import { BondBalance, NodeOperatorId, TOKENS } from '@lidofinance/lido-csm-sdk';

export type AddBondFormInputType = {
  token: TOKENS;
  bondAmount?: bigint;
};

export type AddBondFormNetworkData = {
  nodeOperatorId: NodeOperatorId;
  ethBalance: bigint;
  stethBalance: bigint;
  wstethBalance: bigint;
  bond: BondBalance;
  maxStakeEth: bigint;
  isPaused: boolean;
};
