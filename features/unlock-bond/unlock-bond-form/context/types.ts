import { BigNumber } from 'ethers';
import { LoadingRecord, NodeOperatorId } from 'types';

export type UnlockBondFormInputType = {
  amount?: BigNumber;
};

export type UnlockBondFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  lockedBond?: BigNumber;
  etherBalance?: BigNumber;
  loading: LoadingRecord<'lockedBond' | 'etherBalance'>;
};
