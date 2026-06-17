import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { STRATEGY_LAZY } from 'consts';
import { useSiweAuth } from 'modules/siwe';
import { useCallback, useMemo } from 'react';
import invariant from 'tiny-invariant';
import { authErrorKindFromCode } from '../api/errors';
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
  const { token, handleAuthError } = useSiweAuth();
  const queryClient = useQueryClient();
  const connectedKey = useOperatorKey();
  const effectiveKey = opts.operatorKey ?? connectedKey;
  const onAuthError = useCallback(
    (code?: string) => handleAuthError(authErrorKindFromCode(code)),
    [handleAuthError],
  );

  const url = effectiveKey ? `${effectiveKey}/${path}` : undefined;

  // Append the token as the LAST key segment so a re-auth (AUTH_JWT_EXPIRED →
  // signIn sets a new token VALUE, same key/path) produces a new key and React
  // Query refetches — there is no refresh endpoint to retry the errored query in
  // place. Trailing position preserves prefix-based invalidation (summary /
  // operator invalidations by the authPath prefix still match).
  const queryKey = useMemo<readonly unknown[]>(() => {
    const base = effectiveKey
      ? surveysKeys.path(effectiveKey, path)
      : surveysKeys.pending(path);
    return token ? [...base, token] : base;
  }, [effectiveKey, path, token]);

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
        onAuthError,
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
        onAuthError,
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
      await surveysDelete(requireUrl(), {
        token,
        onAuthError,
      });
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
