import {
  KeyWithStatus,
  NodeOperatorId,
  NodeOperatorInfo,
} from '@lidofinance/lido-csm-sdk';
import { LoadingRecord } from 'types';

export type EjectKeysFormInputType = {
  selection: number[];
  feeAmount?: bigint;
};

export type EjectKeysFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  curveId?: bigint;
  ethBalance?: bigint;
  keys?: KeyWithStatus[];
  info?: NodeOperatorInfo;
  ejectKeyFee?: bigint;
  loading: LoadingRecord<
    'ethBalance' | 'keys' | 'info' | 'ejectKeyFee' | 'curveId'
  >;
};
