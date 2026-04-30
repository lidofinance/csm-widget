import {
  NodeOperatorId,
  NodeOperatorInviteInfo,
} from '@lidofinance/lido-csm-sdk';
import { Address } from 'viem';

export type AcceptInviteFormInputType = {
  invite?: NodeOperatorInviteInfo;
};

export type AcceptInviteFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  invites: NodeOperatorInviteInfo[];
  address: Address;
};
