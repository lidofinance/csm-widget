import {
  endpoints,
  OperatorKey,
  surveysKeys,
  useOperatorKey,
  useSurveysMutation,
  useSurveysQuery,
} from 'modules/surveys-sdk';
import { useCallback, useMemo } from 'react';
import invariant from 'tiny-invariant';
import { Delegate, DelegatesResponse, MAX_DELEGATES } from '../types';

export const useDelegates = () => {
  const operatorKey = useOperatorKey();

  const requireKey = useCallback((): OperatorKey => {
    invariant(operatorKey, 'useDelegates: operator key is not available');
    return operatorKey;
  }, [operatorKey]);

  const queryKey = useMemo(
    () =>
      operatorKey
        ? surveysKeys.path(operatorKey, 'delegates')
        : surveysKeys.pending('delegates'),
    [operatorKey],
  );

  const invalidate = useMemo<readonly (readonly unknown[])[]>(
    () =>
      operatorKey ? [queryKey, surveysKeys.summary(operatorKey)] : [queryKey],
    [operatorKey, queryKey],
  );

  const query = useSurveysQuery<DelegatesResponse>(
    operatorKey ? endpoints.delegates(operatorKey) : '',
    {
      queryKey,
      enabled: operatorKey !== undefined,
    },
  );

  const addMutation = useSurveysMutation<Delegate, Delegate>(
    () => endpoints.delegates(requireKey()),
    {
      mutationKey: ['surveys-delegates-add', operatorKey],
      invalidate,
    },
  );

  const removeMutation = useSurveysMutation<unknown, string>(
    (address) => endpoints.delegate(requireKey(), address),
    {
      method: 'DELETE',
      mutationKey: ['surveys-delegates-remove', operatorKey],
      invalidate,
    },
  );

  const add = useCallback(
    (address: string) => addMutation.mutateAsync({ address }),
    [addMutation],
  );

  const remove = useCallback(
    (address: string) => removeMutation.mutateAsync(address),
    [removeMutation],
  );

  return {
    delegates: query.data?.delegates ?? [],
    isLoading: query.isLoading,
    error: query.error,
    add,
    remove,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    canAddMore: (query.data?.delegates?.length ?? 0) < MAX_DELEGATES,
  };
};
