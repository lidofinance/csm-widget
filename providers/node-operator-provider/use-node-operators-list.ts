import { useCallback, useMemo } from 'react';
import { useCsmNodeOperators } from 'shared/hooks';
import { NodeOperator } from 'types';
import { mergeRoles } from 'utils';
import { useCachedNodeOperator } from './use-cached-node-operator';
import { ROLES } from 'consts/roles';

export const useNodeOperatorsList = () => {
  const { data, initialLoading, mutate } = useCsmNodeOperators();

  const cached = useCachedNodeOperator();

  const append = useCallback(
    (income: NodeOperator) => {
      // TODO: fix for spectacular
      if (income.roles.length > 0) {
        void mutate((prev = []) => [
          ...mergeRoles(prev, {
            id: income.id,
            manager: income.roles.includes(ROLES.MANAGER),
            rewards: income.roles.includes(ROLES.REWARDS),
          }),
        ]);
      }
    },
    [mutate],
  );

  const list = useMemo(
    () => (data?.length ? data : cached ? [cached] : []),
    [cached, data],
  );

  return {
    list,
    isListLoading: initialLoading && list.length === 0,
    append,
  };
};
