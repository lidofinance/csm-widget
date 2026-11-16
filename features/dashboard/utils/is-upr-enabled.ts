import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

type Params = {
  nodeOperatorId: NodeOperatorId | undefined;
  isCSM: boolean;
  isMainnet: boolean;
};

// /api/performance has no module param: strict CSM only, else another operator's rating leaks
export const isUprEnabled = ({ nodeOperatorId, isCSM, isMainnet }: Params) =>
  nodeOperatorId !== undefined && isCSM && isMainnet;
