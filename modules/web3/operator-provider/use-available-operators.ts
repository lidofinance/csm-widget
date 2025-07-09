import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import { useMemo } from 'react';
import { useDappStatus } from '../hooks';
import { useLidoSDK } from '../web3-provider';
import { useCachedNodeOperator } from './use-cached-node-operator';
import invariant from 'tiny-invariant';

export const useAvailableOperators = () => {
  const { csm } = useLidoSDK();
  const { address } = useDappStatus();

  const { data: cached } = useCachedNodeOperator();
  const placeholderData = useMemo(
    () => (cached ? [cached] : undefined),
    [cached],
  );

  return useQuery({
    queryKey: ['node-operators', { address }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(address);
      return csm.satellite.getNodeOperatorsByAddress({ address });
      // return csm.events.getNodeOperatorsByAddress(address);
    },
    enabled: !!address,
    placeholderData,
  });
};
