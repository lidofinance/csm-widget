import { LoadingRecord, NodeOperatorInvite } from 'types';

export type AcceptInviteFormInputType = {
  invite?: NodeOperatorInvite;
};

export type AcceptInviteFormNetworkData = {
  invites?: NodeOperatorInvite[];
  loading: LoadingRecord<'invites'>;
};
