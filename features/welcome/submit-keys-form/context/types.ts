import { BigNumber, BytesLike } from 'ethers';
import { type TOKENS } from 'shared/hook-form/controls/token-select-hook-form';
import { Address } from 'wagmi';
import { NodeOperatorFileKey } from './operators.types';

export type SubmitKeysFormDataContextValue = SubmitKeysFormNetworkData &
  ExtraSubmitKeysFormDataType;

export type SubmitKeysFormInputType = {
  token: TOKENS;
  parsedKeys: NodeOperatorFileKey[];
  referral: Address | null;
};

export type SubmitKeysFormLoading = {
  isEtherBalanceLoading: boolean;
  isStethBalanceLoading: boolean;
  isWstethBalanceLoading: boolean;
  isMultisigLoading: boolean;
  isMaxGasPriceLoading: boolean;
  isEaProofLoading: boolean;
};

export type SubmitKeysFormNetworkData = {
  etherBalance?: BigNumber;
  stethBalance?: BigNumber;
  wstethBalance?: BigNumber;
  isMultisig?: boolean;
  gasLimit?: BigNumber;
  gasCost?: BigNumber;
  eaProof?: BytesLike[];
  loading: SubmitKeysFormLoading;
  revalidate: () => Promise<void>;
};

export type SubmitKeysFormValidationContext = {
  isWalletActive: boolean;
  gasCost: BigNumber;
  etherBalance: BigNumber;
  isMultisig: boolean;
};

export type ExtraSubmitKeysFormDataType = {
  bondAmount?: BigNumber;
  isBondAmountLoading: boolean;
};
