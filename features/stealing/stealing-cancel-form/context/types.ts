import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { LoadingRecord } from 'types';

export type StealingCancelFormInputType = {
  amount?: bigint;
  nodeOperatorId?: NodeOperatorId;
  maxAmount?: bigint;
};

export type StealingCancelFormNetworkData = {
  ethBalance?: bigint;
  nodeOperatorsCount?: bigint;
  loading: LoadingRecord<'ethBalance' | 'nodeOperatorsCount'>;
};
