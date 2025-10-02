import {
  CurveParameters,
  Proof,
  ShareLimitInfo,
  ShareLimitStatus,
} from '@lidofinance/lido-csm-sdk';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { DepositDataInputType } from 'shared/hook-form/deposit-data';
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
  address?: Address;
  ethBalance?: bigint;
  stethBalance?: bigint;
  wstethBalance?: bigint;
  curveId?: bigint;
  curveParameters?: CurveParameters;
  maxStakeEth?: bigint;
  keysAvailable?: KeysAvailable;
  isPaused?: boolean;
  proof?: Proof;
  shareLimit?: ShareLimitInfo;
  shareLimitStatus?: ShareLimitStatus;
  blockNumber?: number;
  loading: LoadingRecord<
    | 'ethBalance'
    | 'stethBalance'
    | 'wstethBalance'
    | 'maxStakeEther'
    | 'status'
    | 'shareLimit'
    | 'blockNumber'
    | 'proof'
    | 'icsPaused'
    | 'plsCurveId'
    | 'icsCurveId'
    | 'curveParameters'
  >;
};
