import { NodeOperatorId, NodeOperatorInfo } from '@lidofinance/lido-csm-sdk';
import { KeyWithStatus } from 'shared/hooks';
import { LoadingRecord } from 'types';

export type EjectKeysFormInputType = {
  selection: {
    start: number;
    count: number;
  };
};

export type EjectKeysFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  curveId?: bigint;
  ethBalance?: bigint;
  keys?: KeyWithStatus[];
  info?: NodeOperatorInfo;
  withdrawalRequestFee?: bigint;
  loading: LoadingRecord<
    'ethBalance' | 'keys' | 'info' | 'withdrawalRequestFee' | 'curveId'
  >;
};
