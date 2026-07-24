import {
  callSurvey,
  OperatorKey,
  surveyRequest,
  surveysKeys,
  useOperatorKey,
  useSurveyMutation,
  useSurveyQuery,
} from 'modules/surveys-sdk';
import {
  delegatesAdd,
  delegatesList,
  delegatesRemove,
} from 'modules/surveys-sdk/generated';
import { useCallback, useMemo } from 'react';
import invariant from 'tiny-invariant';
import type { AddDelegateDto } from 'modules/surveys-sdk/generated';
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

  const query = useSurveyQuery<DelegatesResponse>(
    queryKey,
    ({ token, signal }) =>
      callSurvey(() =>
        delegatesList({
          ...surveyRequest(token, signal),
          path: { nodeOperatorId: requireKey() },
        }),
      ),
    { enabled: operatorKey !== undefined },
  );

  const addMutation = useSurveyMutation<Delegate, AddDelegateDto>(
    (body, { token }) =>
      callSurvey(() =>
        delegatesAdd({
          ...surveyRequest(token),
          path: { nodeOperatorId: requireKey() },
          body,
        }),
      ),
    {
      mutationKey: ['surveys-delegates-add', operatorKey],
      invalidate,
    },
  );

  const removeMutation = useSurveyMutation<unknown, string>(
    (address, { token }) =>
      callSurvey(() =>
        delegatesRemove({
          ...surveyRequest(token),
          path: { nodeOperatorId: requireKey(), address },
        }),
      ),
    {
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
