import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSurveysFetcher } from './use-surveys-fetcher';
import { useCallback, useMemo } from 'react';
import { STRATEGY_LAZY } from 'consts';
import { useNodeOperatorId } from 'modules/web3';

type Options<T, R> = {
  skipFetching?: boolean;
  transformIncoming?: (d: R) => T;
  transformOutcoming?: (d: T) => R;
  operatorId?: string;
  invalidateOnMutate?: boolean;
};

export const useSurveysSWR = <T, R = T>(
  path: string,
  options?: Options<T, R>,
) => {
  const nodeOperatorId = useNodeOperatorId();
  const effectiveOperatorId = options?.operatorId ?? `csm-${nodeOperatorId}`;
  const url = `${effectiveOperatorId}/${path}`;
  const queryKey = useMemo(
    () => ['surveys', effectiveOperatorId, path],
    [effectiveOperatorId, path],
  );

  const queryClient = useQueryClient();
  const [fetcher, updater] = useSurveysFetcher<T, R>(
    options?.transformIncoming,
    options?.transformOutcoming,
  );

  const query = useQuery<T>({
    queryKey,
    queryFn: () => fetcher(url),
    enabled:
      !options?.skipFetching &&
      (options?.operatorId !== undefined || nodeOperatorId !== undefined),
    ...STRATEGY_LAZY,
  });

  const updateMutation = useMutation({
    mutationFn: (data: T) => updater(url, data)(),
    onSuccess: (result) => {
      if (options?.invalidateOnMutate) {
        void queryClient.invalidateQueries({ queryKey });
      } else {
        queryClient.setQueryData(queryKey, result);
      }
      void queryClient.invalidateQueries({
        queryKey: ['surveys', effectiveOperatorId, 'summary'],
      });
    },
    onError: () => {
      void queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => updater(url, null)(),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['surveys', effectiveOperatorId],
      });
    },
    onError: () => {
      void queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  const mutate = useCallback(
    (data?: T) => {
      if (data === undefined) {
        void queryClient.invalidateQueries({
          queryKey,
        });
        return Promise.resolve();
      }
      return updateMutation.mutateAsync(data);
    },
    [queryClient, queryKey, updateMutation],
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
  };
};
