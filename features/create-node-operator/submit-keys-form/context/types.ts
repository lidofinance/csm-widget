import { type TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { DepositDataInputType } from 'shared/hook-form/form-controller';
import { LoadingRecord, Proof } from 'types';
import { Address } from 'wagmi';

export type SubmitKeysFormInputType = {
  token: TOKENS;
  bondAmount?: BigNumber;
  referral?: Address;
  rewardsAddress?: string;
  managerAddress?: string;
} & DepositDataInputType;

export type SubmitKeysFormNetworkData = {
  etherBalance?: BigNumber;
  stethBalance?: BigNumber;
  wstethBalance?: BigNumber;
  eaProof?: Proof;
  curveId?: BigNumber;
  maxStakeEther?: BigNumber | null;
  loading: LoadingRecord<
    | 'etherBalance'
    | 'stethBalance'
    | 'wstethBalance'
    | 'eaProof'
    | 'curveId'
    | 'maxStakeEther'
  >;
};
