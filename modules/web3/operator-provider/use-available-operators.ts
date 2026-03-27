import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useMemo } from 'react';
import invariant from 'tiny-invariant';
import { useDappStatus } from '../hooks';
import { useSmSDK } from '../web3-provider';
import { useCachedNodeOperator } from './use-cached-node-operator';

export const KEY_OPERATORS = ['node-operators'];

export const useAvailableOperators = () => {
  const { discovery } = useSmSDK();
  const { address } = useDappStatus();

  const { data: cached } = useCachedNodeOperator();
  const placeholderData = useMemo(
    () => (cached ? [cached] : undefined),
    [cached],
  );

  return useQuery({
    queryKey: [...KEY_OPERATORS, { address }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(address);
      return discovery.getNodeOperatorsByAddress(address);
    },
    enabled: !!address,
    placeholderData,
  });
};
