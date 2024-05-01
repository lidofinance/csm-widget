import { BigNumber } from 'ethers';
import { type TOKENS } from 'consts/tokens';

export type AddBondFormDataContextValue = AddBondFormNetworkData;

export type AddBondFormInputType = {
  token: TOKENS;
  amount: BigNumber | null;
};

export type AddBondFormLoading = {
  isEtherBalanceLoading: boolean;
  isStethBalanceLoading: boolean;
  isWstethBalanceLoading: boolean;
  isMultisigLoading: boolean;
  isMaxGasPriceLoading: boolean;
};

export type AddBondFormNetworkData = {
  etherBalance?: BigNumber;
  stethBalance?: BigNumber;
  wstethBalance?: BigNumber;
  maxGasPrice?: BigNumber;
  isMultisig?: boolean;
  loading: AddBondFormLoading;
  revalidate: () => Promise<void>;
};

export type AddBondFormValidationContext = {
  isWalletActive: boolean;
  gasCost: BigNumber;
  etherBalance: BigNumber;
  isMultisig: boolean;
};
