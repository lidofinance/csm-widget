import { NodeOperatorId } from 'types';
import { useCSModuleRPC } from './useCsmContracts';
import { useContractSWR } from '@lido-sdk/react';

export const useNodeOperatorSummary = (nodeOperatorId?: NodeOperatorId) => {
  return useContractSWR({
    contract: useCSModuleRPC(),
    method: 'getNodeOperatorSummary',
    params: [nodeOperatorId],
    shouldFetch: !!nodeOperatorId,
  });
};
