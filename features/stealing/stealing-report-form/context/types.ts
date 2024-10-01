import { BigNumber } from 'ethers';
import { LoadingRecord, NodeOperatorId } from 'types';

export type StealingReportFormInputType = {
  amount?: BigNumber;
  nodeOperatorId?: NodeOperatorId;
  blockhash?: string;
};

export type StealingReportFormNetworkData = {
  etherBalance?: BigNumber;
  nodeOperatorsCount?: BigNumber;
  loading: LoadingRecord<'etherBalance' | 'nodeOperatorsCount'>;
};
