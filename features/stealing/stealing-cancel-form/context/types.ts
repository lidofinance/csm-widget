import { BigNumber } from 'ethers';
import { LoadingRecord, NodeOperatorId } from 'types';

export type StealingCancelFormInputType = {
  amount?: BigNumber;
  nodeOperatorId?: NodeOperatorId;
};

export type StealingCancelFormNetworkData = {
  etherBalance?: BigNumber;
  nodeOperatorsCount?: BigNumber;
  loading: LoadingRecord<'etherBalance' | 'nodeOperatorsCount'>;
};
