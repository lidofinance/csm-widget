import { NodeOperatorId } from 'types';
import { useCSModuleRPC } from './useCsmContracts';
import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_EAGER } from 'consts/swr-strategies';
import { useMemo } from 'react';
import { AddressZero } from '@ethersproject/constants';

const clearEmptyAddress = (address?: string) => {
  return address !== AddressZero ? address : undefined;
};

export const useNodeOperatorInfo = (
  nodeOperatorId?: NodeOperatorId,
  config = STRATEGY_EAGER,
) => {
  const swr = useContractSWR({
    contract: useCSModuleRPC(),
    method: 'getNodeOperator',
    params: [nodeOperatorId],
    shouldFetch: !!nodeOperatorId,
    config,
  });

  const fixedData = useMemo(() => {
    return swr.data
      ? {
          ...swr.data,
          proposedRewardAddress: clearEmptyAddress(
            swr.data.proposedRewardAddress,
          ),
          proposedManagerAddress: clearEmptyAddress(
            swr.data.proposedManagerAddress,
          ),
        }
      : undefined;
  }, [swr.data]);

  return { ...swr, data: swr.data ? fixedData : undefined };
};
