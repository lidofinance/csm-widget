import { NodeOperatorId } from '@lidofinance/lido-csm-sdk/common';
import { LoadingRecord } from 'types';

export type UnlockBondFormInputType = {
  amount?: bigint;
};

export type UnlockBondFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  lockedBond?: bigint;
  ethBalance?: bigint;
  loading: LoadingRecord<'lockedBond' | 'ethBalance'>;
};
