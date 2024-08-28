import { Address } from 'wagmi';
import { LoadingRecord, NodeOperatorInvite } from 'types';

export type AcceptInviteFormInputType = {
  invite?: NodeOperatorInvite;
};

export type AcceptInviteFormNetworkData = {
  invites?: NodeOperatorInvite[];
  address: Address;
  loading: LoadingRecord<'invites'>;
};
