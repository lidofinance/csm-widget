import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { ModuleInvite } from 'modules/web3';
import type { IntentFormInput } from 'shared/form-page';
import { Address } from 'viem';

export type AcceptInviteFormInputType = IntentFormInput;

export type AcceptInviteFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  invites: ModuleInvite[];
  address: Address;
};
