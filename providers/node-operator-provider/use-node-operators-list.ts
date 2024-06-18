import { useCallback, useEffect } from 'react';
import { NodeOperatorRoles } from 'types';
import { Address } from 'wagmi';
import { useCachedNodeOperator } from './use-cached-node-operator';
import { useNodeOperatorsFromEvents } from './use-node-operators-from-events';

const EMPTY_LIST: NodeOperatorRoles[] = [];

export const useNodeOperatorsList = (address?: Address) => {
  const { data, initialLoading, mutate } = useNodeOperatorsFromEvents(address);

  const [cached, setCached] = useCachedNodeOperator(address);

  const append = useCallback(
    (nodeOperator: NodeOperatorRoles) => {
      void mutate([...(data ?? []), nodeOperator], false);
    },
    [data, mutate],
  );

  useEffect(() => {
    if (cached) {
      void mutate((old) => {
        const found = old?.find(({ id }) => id === cached.id);
        return found ? old : [cached, ...(old ?? [])];
      }, false);
    }
  }, [cached, mutate]);

  return {
    list: data ?? EMPTY_LIST,
    isListLoading: initialLoading,
    append,
    setCached,
  };
};
