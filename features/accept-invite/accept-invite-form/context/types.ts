import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { ModuleInvite } from 'modules/web3';
import { Address } from 'viem';

export type AcceptInviteFormInputType = {
  invite?: ModuleInvite;
};

export type AcceptInviteFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  invites: ModuleInvite[];
  address: Address;
};
