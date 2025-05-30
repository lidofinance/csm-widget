import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import { useMemo } from 'react';
import { useDappStatus } from '../hooks';
import { useLidoSDK } from '../web3-provider';
import { useCachedNodeOperator } from './use-cached-node-operator';

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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: async () => csm.events.getNodeOperatorsByAddress(address!),
    enabled: !!address,
    placeholderData,
  });
};
