import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { STRATEGY_LAZY } from 'consts';
import { useNodeOperatorId } from 'modules/web3';
import { useCallback } from 'react';
import { useSurveysFetcher } from '../shared/use-surveys-fetcher';
import { Delegate, DelegatesResponse, MAX_DELEGATES } from '../types';

export const useDelegates = () => {
  const nodeOperatorId = useNodeOperatorId();
  const effectiveOperatorId = `csm-${nodeOperatorId}`;
  const url = `${effectiveOperatorId}/delegates`;
  const queryKey = ['surveys', effectiveOperatorId, 'delegates'];
  const summaryQueryKey = ['surveys', effectiveOperatorId, 'summary'];

  const queryClient = useQueryClient();

  const [fetcher, updater] = useSurveysFetcher<DelegatesResponse, Delegate>(
    undefined,
    (data) => data.delegates[0],
  );

  const query = useQuery<DelegatesResponse>({
    queryKey,
    queryFn: () => fetcher(url),
    enabled: nodeOperatorId !== undefined,
    ...STRATEGY_LAZY,
  });

  const addMutation = useMutation({
    mutationFn: (address: string) =>
      updater(url, { delegates: [{ address }] })(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
      void queryClient.invalidateQueries({ queryKey: summaryQueryKey });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (address: string) => updater(`${url}/${address}`, null)(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
      void queryClient.invalidateQueries({ queryKey: summaryQueryKey });
    },
  });

  const add = useCallback(
    (address: string) => addMutation.mutateAsync(address),
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
