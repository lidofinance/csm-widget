import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

export type MetadataFormInputType = {
  name: string;
  description: string;
};

export type MetadataFormNetworkData = {
  nodeOperatorId: NodeOperatorId;
  currentName: string;
  currentDescription: string;
  ownerEditsRestricted: boolean;
};
