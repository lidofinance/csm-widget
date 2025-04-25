import { type TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { DepositDataInputType } from 'shared/hook-form/form-controller';
import { KeysAvailable, ShareLimitInfo } from 'shared/hooks';
import { LoadingRecord } from 'types';
import { Address } from 'viem';

export type SubmitKeysFormInputType = {
  token: TOKENS;
  bondAmount?: BigNumber;
  referrer?: Address;
  rewardsAddress?: string;
  managerAddress?: string;
  extendedManagerPermissions: boolean;
  specifyCustomAddresses: boolean;
  specifyReferrrer: boolean;
} & DepositDataInputType;

export type SubmitKeysFormNetworkData = {
  etherBalance?: BigNumber;
  stethBalance?: BigNumber;
  wstethBalance?: BigNumber;
  curveId?: BigNumber;
  maxStakeEther?: BigNumber | null;
  keysAvailable?: KeysAvailable;
  isPaused?: boolean;
  shareLimit?: ShareLimitInfo;
  blockNumber?: number;
  loading: LoadingRecord<
    | 'etherBalance'
    | 'stethBalance'
    | 'wstethBalance'
    | 'curveId'
    | 'maxStakeEther'
    | 'status'
    | 'shareLimit'
    | 'blockNumber'
  >;
};
