import { useCallback, useMemo } from 'react';
import { NodeOperatorRoles } from 'types';
import { mergeRoles } from './mergeRoles';
import { useCachedNodeOperator } from './use-cached-node-operator';
import { useNodeOperatorsFromEvents } from './use-node-operators-from-events';

export const useNodeOperatorsList = () => {
  const { data, initialLoading, mutate } = useNodeOperatorsFromEvents();

  const cached = useCachedNodeOperator();

  const append = useCallback(
    (income: NodeOperatorRoles) => {
      if (income.manager || income.rewards) {
        void mutate((prev) => [...mergeRoles(prev, income)]);
      }
    },
    [mutate],
  );

  const list = useMemo(() => data ?? (cached ? [cached] : []), [cached, data]);

  return {
    list,
    isListLoading: initialLoading && list.length === 0,
    append,
  };
};
