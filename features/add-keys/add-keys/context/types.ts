import { ShareLimitInfo } from '@lidofinance/lido-csm-sdk';
import {
  BondBalance,
  NodeOperatorId,
  TOKENS,
} from '@lidofinance/lido-csm-sdk/common';
import { DepositDataInputType } from 'shared/hook-form/form-controller';
// import { KeysAvailable } from 'shared/hooks';
import { LoadingRecord } from 'types';

export type AddKeysFormInputType = {
  token: TOKENS;
  bondAmount?: bigint;
} & DepositDataInputType;

export type AddKeysFormNetworkData = {
  ethBalance?: bigint;
  stethBalance?: bigint;
  wstethBalance?: bigint;
  nodeOperatorId?: NodeOperatorId;
  // keysAvailable?: KeysAvailable;
  bond?: BondBalance;
  isPaused?: boolean;
  maxStakeEth?: bigint;
  shareLimit?: ShareLimitInfo;
  blockNumber?: number;
  loading: LoadingRecord<
    | 'ethBalance'
    | 'stethBalance'
    | 'wstethBalance'
    | 'bond'
    | 'maxStakeEth'
    | 'status'
    | 'shareLimit'
    | 'blockNumber'
  >;
};
