import { NodeOperatorId } from 'types';
import { useCSModuleRPC } from './useCsmContracts';
import { useContractSWR } from '@lido-sdk/react';

export const useNodeOperatorInfo = (nodeOperatorId?: NodeOperatorId) => {
  return useContractSWR({
    contract: useCSModuleRPC(),
    method: 'getNodeOperator',
    params: [nodeOperatorId],
    shouldFetch: !!nodeOperatorId,
  });
};
