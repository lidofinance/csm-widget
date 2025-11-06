import { NodeOperatorId, NodeOperatorInvite } from '@lidofinance/lido-csm-sdk';
import { Address } from 'viem';

export type AcceptInviteFormInputType = {
  invite?: NodeOperatorInvite;
};

export type AcceptInviteFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  invites: NodeOperatorInvite[];
  address: Address;
};
