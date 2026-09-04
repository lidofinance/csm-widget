import {
  CurveParameters,
  CurveRef,
  MODULE_NAME,
  Proof,
  ShareLimitInfo,
  ShareLimitStatus,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import type { FileUploadItemDto } from 'modules/surveys-sdk/generated';
import { CreatableModule } from 'providers/create-type-provider';
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
  targetModule: MODULE_NAME.CSM | MODULE_NAME.CSM_02;
  address: Address;
  ethBalance: bigint;
  stethBalance: bigint;
  wstethBalance: bigint;
  curve: CurveRef<CreatableModule>;
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
