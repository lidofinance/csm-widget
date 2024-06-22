import { useCallback, useEffect } from 'react';
import { NodeOperatorRoles } from 'types';
import { Address } from 'wagmi';
import { useCachedNodeOperator } from './use-cached-node-operator';
import { useNodeOperatorsFromEvents } from './use-node-operators-from-events';

const EMPTY_LIST: NodeOperatorRoles[] = [];

const mergeRoles = (
  list: NodeOperatorRoles[] | undefined = [],
  patch: NodeOperatorRoles,
): NodeOperatorRoles[] => {
  const copy = list.slice();
  const index = list.findIndex(({ id }) => id === patch.id);
  const item = { ...list[index], ...patch };

  if (item.manager || item.rewards) {
    copy.splice(index >= 0 ? index : list.length, 1, item);
  } else {
    copy.splice(index >= 0 ? index : list.length, 1);
  }

  return copy;
};

export const useNodeOperatorsList = (address?: Address) => {
  const { data, initialLoading, mutate } = useNodeOperatorsFromEvents(address);

  const [cached, setCached] = useCachedNodeOperator(address);

  const append = useCallback(
    (income: NodeOperatorRoles) => {
      void mutate((prev) => mergeRoles(prev, income));
      // void mutate([...(data ?? []), nodeOperator], false);
    },
    [mutate],
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
