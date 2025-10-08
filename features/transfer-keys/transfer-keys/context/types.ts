import {
  CurveParameters,
  KeyWithStatus,
  NodeOperatorId,
  NodeOperatorInfo,
} from '@lidofinance/lido-csm-sdk';
import { LoadingRecord } from 'types';

export type TransferKeysFormInputType = {
  count: number;
};

export type TransferKeysFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  keys?: KeyWithStatus[];
  info?: NodeOperatorInfo;
  keysToMigrate?: number;
  curveParameters?: CurveParameters;
  loading: LoadingRecord<'keys' | 'info' | 'keysToMigrate' | 'curveParameters'>;
};
