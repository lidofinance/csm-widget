import {
  CurveParameters,
  Proof,
  ShareLimitInfo,
  ShareLimitStatus,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import { DepositDataInputType } from 'shared/hook-form/deposit-data';
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
  address: Address;
  ethBalance: bigint;
  stethBalance: bigint;
  wstethBalance: bigint;
  curveId: bigint;
  curveParameters: CurveParameters;
  maxStakeEth: bigint;
  isPaused: boolean;
  proof?: Proof;
  shareLimit: ShareLimitInfo;
  shareLimitStatus: ShareLimitStatus;
  // keysAvailable: KeysAvailable;
};
