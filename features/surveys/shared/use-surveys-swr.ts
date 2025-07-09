import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSurveysFetcher } from './use-surveys-fetcher';
import { useCallback } from 'react';
import { STRATEGY_LAZY } from 'consts';
import { useNodeOperatorId } from 'modules/web3';

type Options<T, R> = {
  skipFetching?: boolean;
  transformIncoming?: (d: R) => T;
  transformOutcoming?: (d: T) => R;
};

export const useSurveysSWR = <T, R = T>(
  path: string,
  options?: Options<T, R>,
) => {
  const nodeOperatorId = useNodeOperatorId();
  const url = `csm-${String(nodeOperatorId)}/${path}`;
  const queryClient = useQueryClient();

  const [fetcher, updater] = useSurveysFetcher<T, R>(
    options?.transformIncoming,
    options?.transformOutcoming,
  );

  const query = useQuery<T>({
    queryKey: ['surveys', url],
    queryFn: () => fetcher(url),
    enabled: !options?.skipFetching && !!nodeOperatorId,
    ...STRATEGY_LAZY,
  });

  const updateMutation = useMutation({
    mutationFn: (data: T) => updater(url, data)(),
    onSuccess: (result) => {
      queryClient.setQueryData(['surveys', url], result);
    },
    onError: () => {
      void queryClient.invalidateQueries({ queryKey: ['surveys', url] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => updater(url, null)(),
    onSuccess: () => {
      queryClient.setQueryData(['surveys', url], null);
    },
    onError: () => {
      void queryClient.invalidateQueries({ queryKey: ['surveys', url] });
    },
  });

  const mutate = useCallback(
    (data?: T) => {
      if (data === undefined) {
        void queryClient.invalidateQueries({ queryKey: ['surveys', url] });
        return Promise.resolve();
      }
      return updateMutation.mutateAsync(data);
    },
    [queryClient, updateMutation, url],
  );

  const remove = useCallback(() => {
    return deleteMutation.mutateAsync();
  }, [deleteMutation]);

  return {
    data: query.data,
    error: query.error,
    isLoading: query.isLoading,
    loading: query.isLoading,
    initialLoading: query.isLoading && query.isFetching,
    mutate,
    remove,
    update: () => {
      void queryClient.invalidateQueries({ queryKey: ['surveys', url] });
      return Promise.resolve();
    },
  };
};
