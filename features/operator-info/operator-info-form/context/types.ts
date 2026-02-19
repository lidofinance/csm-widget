import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

export type OperatorInfoFormInputType = {
  name: string;
  description: string;
};

export type OperatorInfoFormNetworkData = {
  nodeOperatorId: NodeOperatorId;
  currentName: string;
  currentDescription: string;
  ownerEditsRestricted: boolean;
};
