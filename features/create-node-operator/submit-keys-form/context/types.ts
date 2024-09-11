import { type TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { DepositDataInputType } from 'shared/hook-form/form-controller';
import { KeysAvailable } from 'shared/hooks';
import { LoadingRecord, Proof } from 'types';
import { Address } from 'wagmi';

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
  eaProof?: Proof;
  curveId?: BigNumber;
  maxStakeEther?: BigNumber | null;
  keysUploadLimit?: number;
  keysAvailable?: KeysAvailable;
  loading: LoadingRecord<
    | 'etherBalance'
    | 'stethBalance'
    | 'wstethBalance'
    | 'eaProof'
    | 'curveId'
    | 'keysUploadLimit'
    | 'maxStakeEther'
  >;
};
