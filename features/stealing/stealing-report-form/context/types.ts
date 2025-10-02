import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { LoadingRecord } from 'types';

export type StealingReportFormInputType = {
  amount?: bigint;
  nodeOperatorId?: NodeOperatorId;
  blockhash?: string;
};

export type StealingReportFormNetworkData = {
  ethBalance?: bigint;
  nodeOperatorsCount?: bigint;
  loading: LoadingRecord<'ethBalance' | 'nodeOperatorsCount'>;
};
