import { KeyWithStatus, useNodeOperatorInfo } from 'shared/hooks';
import { BondBalance, LoadingRecord, NodeOperatorId } from 'types';

export type RemoveKeysFormInputType = {
  selection: {
    start: number;
    count: number;
  };
};

export type RemoveKeysFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  keys?: KeyWithStatus[];
  info?: ReturnType<typeof useNodeOperatorInfo>['data'];
  bond?: BondBalance;
  loading: LoadingRecord<'keys' | 'bond' | 'info'>;
};
