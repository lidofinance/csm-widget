import { BigNumber } from 'ethers';
import { type TOKENS } from 'consts/tokens';
import { BondBalance, LoadingRecord, NodeOperatorId } from 'types';

export type AddBondFormInputType = {
  token: TOKENS;
  bondAmount?: BigNumber;
};

export type AddBondFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  etherBalance?: BigNumber;
  stethBalance?: BigNumber;
  wstethBalance?: BigNumber;
  bond?: BondBalance;
  maxStakeEther?: BigNumber | null;
  isPaused?: boolean;
  loading: LoadingRecord<
    | 'etherBalance'
    | 'stethBalance'
    | 'wstethBalance'
    | 'bond'
    | 'maxStakeEther'
    | 'status'
  >;
};
