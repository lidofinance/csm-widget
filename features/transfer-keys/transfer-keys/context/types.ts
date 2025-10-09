import {
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
  needCleanup?: boolean;
  loading: LoadingRecord<'keys' | 'info' | 'keysToMigrate' | 'curveParameters'>;
};
