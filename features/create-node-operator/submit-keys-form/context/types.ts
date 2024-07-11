import { type TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { DepositData, LoadingRecord, Proof } from 'types';
import { Address } from 'wagmi';

export type SubmitKeysFormDataContextValue = SubmitKeysFormNetworkData & {
  bondAmount?: BigNumber;
};

export type SubmitKeysFormInputType = {
  token: TOKENS;
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
  loading: LoadingRecord<
    'etherBalance' | 'stethBalance' | 'wstethBalance' | 'eaProof' | 'curveId'
  >;
  revalidate: () => Promise<void>;
};

export type SubmitKeysFormValidationContext = {
  gasCost: BigNumber;
  etherBalance: BigNumber;
};
