import { ShareLimitInfo, ShareLimitStatus } from '@lidofinance/lido-csm-sdk';
import { TOKENS } from '@lidofinance/lido-csm-sdk/common';
import { DepositDataInputType } from 'shared/hook-form/form-controller';
import { KeysAvailable } from 'shared/hooks';
import { LoadingRecord } from 'types';
import { Address } from 'viem';

export type SubmitKeysFormInputType = {
  token: TOKENS;
  bondAmount?: bigint;
  referrer?: Address;
  rewardsAddress?: Address;
  managerAddress?: Address;
  extendedManagerPermissions: boolean;
  specifyCustomAddresses: boolean;
  specifyReferrrer: boolean;
} & DepositDataInputType;

export type SubmitKeysFormNetworkData = {
  ethBalance?: bigint;
  stethBalance?: bigint;
  wstethBalance?: bigint;
  curveId?: bigint;
  maxStakeEth?: bigint;
  keysAvailable?: KeysAvailable;
  isPaused?: boolean;
  shareLimit?: ShareLimitInfo;
  shareLimitStatus?: ShareLimitStatus;
  blockNumber?: number;
  loading: LoadingRecord<
    | 'ethBalance'
    | 'stethBalance'
    | 'wstethBalance'
    | 'curveId'
    | 'maxStakeEther'
    | 'status'
    | 'shareLimit'
    | 'blockNumber'
  >;
};
