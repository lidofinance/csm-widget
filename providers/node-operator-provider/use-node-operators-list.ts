import { useCallback, useMemo } from 'react';
import { NodeOperatorRoles } from 'types';
import { mergeRoles } from 'utils';
import { useCachedNodeOperator } from './use-cached-node-operator';
import { useCsmNodeOperators } from 'shared/hooks';

export const useNodeOperatorsList = () => {
  const { data, initialLoading, mutate } = useCsmNodeOperators();

  const cached = useCachedNodeOperator();

  const append = useCallback(
    (income: NodeOperatorRoles) => {
      // TODO: fix for spectacular
      if (income.manager || income.rewards) {
        void mutate((prev = []) => [...mergeRoles(prev, income)]);
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
