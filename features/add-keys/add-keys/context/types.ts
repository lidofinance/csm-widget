import { type TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { DepositData, NodeOperatorId } from 'types';

export type AddKeysFormDataContextValue = AddKeysFormNetworkData;

export type AddKeysFormInputType = {
  token: TOKENS;
  rawDepositData?: string;
  depositData: DepositData[];
  bondAmount?: BigNumber;
};

export type AddKeysFormLoading = {
  isEtherBalanceLoading: boolean;
  isStethBalanceLoading: boolean;
  isWstethBalanceLoading: boolean;
  isBondBalanceLoading: boolean;
  isMultisigLoading: boolean;
  isMaxGasPriceLoading: boolean;
};

export type AddKeysFormNetworkData = {
  etherBalance?: BigNumber;
  stethBalance?: BigNumber;
  wstethBalance?: BigNumber;
  nodeOperatorId?: NodeOperatorId;
  bondBalance?: BigNumber;
  bondRequired?: BigNumber;
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
