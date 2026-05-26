import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { STRATEGY_LAZY } from 'consts';
import { useSiweAuth } from 'modules/siwe';
import { useCallback, useMemo } from 'react';
import invariant from 'tiny-invariant';
import { surveysDelete, surveysGet, surveysPost } from '../api/surveys-api';
import type { OperatorKey } from '../api/types';
import { useOperatorKey } from './use-operator-key';
import { surveysKeys } from './query-keys';

type UseOperatorSurveyOptions<T, R> = {
  operatorKey?: OperatorKey;
  skipFetching?: boolean;
  transformIncoming?: (d: R) => T;
  transformOutgoing?: (d: T) => R;
  invalidateOnMutate?: boolean;
};

export const useOperatorSurvey = <T, R = T>(
  path: string,
  opts: UseOperatorSurveyOptions<T, R> = {},
) => {
  const { token, logout } = useSiweAuth();
  const queryClient = useQueryClient();
  const connectedKey = useOperatorKey();
  const effectiveKey = opts.operatorKey ?? connectedKey;

  const url = effectiveKey ? `${effectiveKey}/${path}` : undefined;

  const queryKey = useMemo<readonly unknown[]>(
    () =>
      effectiveKey
        ? surveysKeys.path(effectiveKey, path)
        : surveysKeys.pending(path),
    [effectiveKey, path],
  );

  const { transformIncoming, transformOutgoing, invalidateOnMutate } = opts;

  const requireUrl = (): string => {
    invariant(url, 'useOperatorSurvey: operator key is not available');
    return url;
  };

  const query = useQuery<T>({
    queryKey,
    queryFn: async ({ signal }) => {
      const res = await surveysGet<R>(requireUrl(), {
        token,
        onAuthError: logout,
        signal,
      });
      return res && transformIncoming
        ? transformIncoming(res)
        : (res as unknown as T);
    },
    enabled: !opts.skipFetching && effectiveKey !== undefined && !!token,
    ...STRATEGY_LAZY,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: T): Promise<T> => {
      const payload = transformOutgoing ? transformOutgoing(data) : data;
      const res = await surveysPost<R, unknown>(requireUrl(), payload, {
        token,
        onAuthError: logout,
      });
      return res && transformIncoming
        ? transformIncoming(res)
        : (res as unknown as T);
    },
    onSuccess: (result) => {
      if (invalidateOnMutate) {
        void queryClient.invalidateQueries({ queryKey });
      } else {
        queryClient.setQueryData(queryKey, result);
      }
      if (effectiveKey) {
        void queryClient.invalidateQueries({
          queryKey: surveysKeys.summary(effectiveKey),
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      await surveysDelete(requireUrl(), { token, onAuthError: logout });
    },
    onSuccess: () => {
      if (effectiveKey) {
        void queryClient.invalidateQueries({
          queryKey: surveysKeys.operator(effectiveKey),
        });
      }
    },
  });

  const mutate = useCallback(
    (data?: T) => {
      if (data === undefined) {
        void queryClient.invalidateQueries({ queryKey });
        return Promise.resolve();
      }
      return updateMutation.mutateAsync(data);
    },
    [queryClient, queryKey, updateMutation],
  );

  const remove = useCallback(
    () => deleteMutation.mutateAsync(),
    [deleteMutation],
  );

  return {
    data: query.data,
    error: query.error,
    isLoading: query.isLoading,
    initialLoading: query.isLoading && query.isFetching,
    mutate,
    remove,
  };
};
