import { BigNumber } from 'ethers';
import { type TOKENS } from 'consts/tokens';
import { NodeOperatorId } from 'types';

export type AddBondFormDataContextValue = AddBondFormNetworkData;

export type AddBondFormInputType = {
  token: TOKENS;
  amount: BigNumber | null;
};

export type AddBondFormLoading = {
  isEtherBalanceLoading: boolean;
  isStethBalanceLoading: boolean;
  isWstethBalanceLoading: boolean;
  isBondBalanceLoading: boolean;
  isMultisigLoading: boolean;
  isMaxGasPriceLoading: boolean;
};

export type AddBondFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  etherBalance?: BigNumber;
  stethBalance?: BigNumber;
  wstethBalance?: BigNumber;
  bondBalance?: BigNumber;
  bondRequired?: BigNumber;
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
