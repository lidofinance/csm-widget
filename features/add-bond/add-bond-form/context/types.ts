import {
  BondBalance,
  NodeOperatorId,
  TOKENS,
} from '@lidofinance/lido-csm-sdk/common';
import { LoadingRecord } from 'types';

export type AddBondFormInputType = {
  token: TOKENS;
  bondAmount?: bigint;
};

export type AddBondFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  ethBalance?: bigint;
  stethBalance?: bigint;
  wstethBalance?: bigint;
  bond?: BondBalance;
  maxStakeEth?: bigint;
  isPaused?: boolean;
  loading: LoadingRecord<
    | 'ethBalance'
    | 'stethBalance'
    | 'wstethBalance'
    | 'bond'
    | 'maxStakeEth'
    | 'status'
  >;
};
