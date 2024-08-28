import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_EAGER } from 'consts/swr-strategies';
import { NodeOperatorId } from 'types';
import { useCSAccountingRPC } from './useCsmContracts';
import { useMemo } from 'react';
import { useMergeSwr } from './useMergeSwr';

export const useNodeOperatorUnbondedKeys = (
  nodeOperatorId?: NodeOperatorId,
  config = STRATEGY_EAGER,
) => {
  const swr = useContractSWR({
    contract: useCSAccountingRPC(),
    method: 'getUnbondedKeysCountToEject',
    params: [nodeOperatorId],
    shouldFetch: !!nodeOperatorId,
    config,
  });

  const data = useMemo(() => {
    return swr.data?.toNumber();
  }, [swr.data]);

  return useMergeSwr([swr], data);
};
