import {
  CurveParameters,
  Proof,
  ShareLimitInfo,
  ShareLimitStatus,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import type { FileUploadItemDto } from 'modules/surveys-sdk/generated';
import { DepositDataInputType } from 'shared/hook-form/deposit-data';
import { KeysAvailable } from 'shared/hooks';
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
  dkgFiles: FileUploadItemDto[];
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
  keysAvailable?: KeysAvailable;
  // Injected by the flow at buildCallback time (not fetched by the data
  // provider): tells the tx success stage to hand off to the members-init
  // stage instead of the final success screen.
  willInitMembers?: boolean;
};
