import { NodeOperatorId } from 'types';
import { useCSModuleRPC } from './useCsmContracts';
import { useContractSWR } from '@lido-sdk/react';

export const useReadNodeOperatorInfo = (id?: NodeOperatorId) => {
  const contract = useCSModuleRPC();

  const { data, initialLoading } = useContractSWR({
    contract,
    method: 'getNodeOperator',
    params: [id],
    shouldFetch: !!id,
  });

  return {
    data,
    initialLoading,
  };
};
