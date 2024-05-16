import { BigNumber } from 'ethers';
import { HexString } from 'shared/keys';
import { NodeOperatorId } from 'types';

export type RemoveKeysFormDataContextValue = RemoveKeysFormNetworkData;

export type RemoveKeysFormInputType = {
  start: number; // 0..[keys.length]
  count: number; // 0..[keys.length]
  offset?: BigNumber; // totalDepositedKeys
};

export type RemoveKeysFormLoading = {
  isKeysLoading: boolean;
  isBondBalanceLoading: boolean;
  isMultisigLoading: boolean;
  isMaxGasPriceLoading: boolean;
};

export type RemoveKeysFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  keys?: HexString[];
  totalDepositedKeys?: BigNumber;
  bondBalance?: BigNumber;
  bondRequired?: BigNumber;
  isMultisig?: boolean;
  gasLimit?: BigNumber;
  gasCost?: BigNumber;
  loading: RemoveKeysFormLoading;
  revalidate: () => Promise<void>;
};

export type RemoveKeysFormValidationContext = {
  nodeOperatorId: NodeOperatorId;
  isWalletActive: boolean;
  gasCost: BigNumber;
  isMultisig: boolean;
};
