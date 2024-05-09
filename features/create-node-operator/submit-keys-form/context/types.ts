import { type TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { DepositData, Proof } from 'types';
import { Address } from 'wagmi';

export type SubmitKeysFormDataContextValue = SubmitKeysFormNetworkData;

export type SubmitKeysFormInputType = {
  token: TOKENS;
  rawDepositData?: string;
  depositData: DepositData[];
  referral?: Address;
  bondAmount?: BigNumber;
  eaProof?: Proof;
};

export type SubmitKeysFormLoading = {
  isEtherBalanceLoading: boolean;
  isStethBalanceLoading: boolean;
  isWstethBalanceLoading: boolean;
  isMultisigLoading: boolean;
  isMaxGasPriceLoading: boolean;
};

export type SubmitKeysFormNetworkData = {
  etherBalance?: BigNumber;
  stethBalance?: BigNumber;
  wstethBalance?: BigNumber;
  isMultisig?: boolean;
  gasLimit?: BigNumber;
  gasCost?: BigNumber;
  loading: SubmitKeysFormLoading;
  revalidate: () => Promise<void>;
};

export type SubmitKeysFormValidationContext = {
  isWalletActive: boolean;
  gasCost: BigNumber;
  etherBalance: BigNumber;
  isMultisig: boolean;
};
