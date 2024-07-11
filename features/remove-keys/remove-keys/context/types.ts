import { BigNumber } from 'ethers';
import { useNodeOperatorInfo } from 'shared/hooks';
import { HexString } from 'shared/keys';
import { BondBalance, LoadingRecord, NodeOperatorId } from 'types';

export type RemoveKeysFormDataContextValue = RemoveKeysFormNetworkData;

export type RemoveKeysFormInputType = {
  selection: {
    start: number;
    count: number;
  };
};

export type RemoveKeysFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  offset?: number; // totalDepositedKeys // TODO: remove
  keys?: HexString[];
  info?: ReturnType<typeof useNodeOperatorInfo>['data'];
  bond?: BondBalance;
  loading: LoadingRecord<'keys' | 'bond' | 'info'>;
  revalidate: () => Promise<void>;
};

export type RemoveKeysFormValidationContext = {
  nodeOperatorId: NodeOperatorId;
  isWalletActive: boolean;
  gasCost: BigNumber;
  isMultisig: boolean;
};
