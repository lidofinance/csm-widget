import { type TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { DepositData, NodeOperatorId } from 'types';

export type AddKeysFormDataContextValue = AddKeysFormNetworkData &
  ExtraAddKeysFormDataType;

export type AddKeysFormInputType = {
  token: TOKENS;
  rawKeys: string;
  parsedKeys: DepositData[];
};

export type AddKeysFormLoading = {
  isEtherBalanceLoading: boolean;
  isStethBalanceLoading: boolean;
  isWstethBalanceLoading: boolean;
  isMultisigLoading: boolean;
  isMaxGasPriceLoading: boolean;
};

export type AddKeysFormNetworkData = {
  etherBalance?: BigNumber;
  stethBalance?: BigNumber;
  wstethBalance?: BigNumber;
  isMultisig?: boolean;
  gasLimit?: BigNumber;
  gasCost?: BigNumber;
  loading: AddKeysFormLoading;
  revalidate: () => Promise<void>;
};

export type AddKeysFormValidationContext = {
  nodeOperatorId: NodeOperatorId;
  isWalletActive: boolean;
  gasCost: BigNumber;
  etherBalance: BigNumber;
  isMultisig: boolean;
};

export type ExtraAddKeysFormDataType = {
  bondAmount?: BigNumber;
  isBondAmountLoading: boolean;
};
