import {
  KeyWithStatus,
  NodeOperatorId,
  NodeOperatorInfo,
} from '@lidofinance/lido-csm-sdk';
import { LoadingRecord } from 'types';

export type EjectKeysFormInputType = {
  selection: number[];
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
