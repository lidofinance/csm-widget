import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { Address } from 'viem';

export type ClaimerFormInputType = {
  address?: Address;
  isUnset: boolean;
};

export type ClaimerFormNetworkData = {
  address: Address;
  nodeOperatorId: NodeOperatorId;
  currentClaimerAddress: Address | undefined;
};
