import { NodeOperatorInvite } from '@lidofinance/lido-csm-sdk';
import { LoadingRecord } from 'types';
import { Address } from 'viem';

export type AcceptInviteFormInputType = {
  invite?: NodeOperatorInvite;
};

export type AcceptInviteFormNetworkData = {
  invites?: NodeOperatorInvite[];
  address: Address;
  loading: LoadingRecord<'invites'>;
};
