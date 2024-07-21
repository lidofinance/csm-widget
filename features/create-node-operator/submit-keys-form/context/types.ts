import { type TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { DepositData, LoadingRecord, Proof } from 'types';
import { Address } from 'wagmi';

export type SubmitKeysFormDataContextValue = SubmitKeysFormNetworkData;

export type SubmitKeysFormInputType = {
  token: TOKENS;
  bondAmount?: BigNumber;
  rawDepositData?: string;
  depositData: DepositData[];
  referral?: Address;
  rewardsAddress?: string;
  managerAddress?: string;
};

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
