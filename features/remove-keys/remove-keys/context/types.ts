import { KeyWithStatus, NodeOperatorInfo } from '@lidofinance/lido-csm-sdk';
import { BondBalance, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { LoadingRecord } from 'types';

export type RemoveKeysFormInputType = {
  selection: {
    start: number;
    count: number;
  };
};

export type RemoveKeysFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  curveId?: bigint;
  keys?: KeyWithStatus[];
  info?: NodeOperatorInfo;
  bond?: BondBalance;
  removalFee?: bigint;
  loading: LoadingRecord<'keys' | 'bond' | 'info' | 'removalFee' | 'curveId'>;
};
