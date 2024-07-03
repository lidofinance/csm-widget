import { BigNumber } from 'ethers';
import { HexString } from 'shared/keys';
import { NodeOperatorId } from 'types';

export type RemoveKeysFormDataContextValue = RemoveKeysFormNetworkData;

export type RemoveKeysFormInputType = {
  selection: {
    start: number; // 0..[keys.length]
    count: number; // 0..[keys.length]
  };
  offset?: number; // totalDepositedKeys
};

export type RemoveKeysFormLoading = {
  isKeysLoading: boolean;
  isBondBalanceLoading: boolean;
  isInfoLoading: boolean;
  isMultisigLoading: boolean;
  isMaxGasPriceLoading: boolean;
};

export type RemoveKeysFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  keys?: HexString[];
  totalDepositedKeys?: number;
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
