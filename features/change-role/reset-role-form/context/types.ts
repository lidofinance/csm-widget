import { LoadingRecord, NodeOperatorId } from 'types';

export type ResetRoleFormInputType = { address?: string };

export type ResetRoleFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  currentAddress?: string;
  proposedAddress?: string;
  loading: LoadingRecord<'info'>;
};
