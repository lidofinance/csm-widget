import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { Address } from 'viem';

export type ClaimerIntent = 'unset';

export type ClaimerFormInputType = {
  address?: Address;
  intent?: ClaimerIntent;
};

export type ClaimerFormNetworkData = {
  nodeOperatorId: NodeOperatorId;
  currentClaimerAddress: Address | undefined;
  canEdit: boolean;
};
