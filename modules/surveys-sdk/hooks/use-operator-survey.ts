import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { STRATEGY_LAZY } from 'consts';
import { useSiweAuth } from 'modules/siwe';
import { useCallback, useMemo } from 'react';
import invariant from 'tiny-invariant';
import { dispatchAuthError } from '../api/errors';
import type { OperatorKey } from '../api/types';
import { useOperatorKey } from './use-operator-key';
import { surveysKeys, withAuthToken } from './query-keys';

// Combined per-operator survey hook: a GET query plus optional update (POST) and
// delete (DELETE) mutations for one survey resource. Thunk-based successor to the
// path-string version — instead of a `path` that the old `surveysGet/Post/Delete`
// transport turned into a URL, the caller supplies operation thunks that run the
// matching generated SDK calls through `callSurvey`. Each path maps to DIFFERENT
// typed SDK functions, so the transport can no longer be derived from a string.
//
// Parity with the old hook is deliberate (orchestration + public return shape are
// unchanged; only the transport is swapped):
//   • pathKey — used ONLY to build the React Query key, via the SAME
//     `surveysKeys.path(effectiveKey, pathKey)` / `surveysKeys.pending(pathKey)`
//     + `withAuthToken`, so cache identity / invalidation are byte-for-byte
//     identical to before.
//   • effectiveKey — `opts.operatorKey ?? useOperatorKey()`; passed to each thunk
//     as `nodeOperatorId`.
//   • Token + auth-error callback come from `useSiweAuth()`. The configured survey
//     client no longer fires `onAuthError`, so we reproduce it here via the shared
//     `dispatchAuthError` helper: on a thrown error it classifies and calls
//     `handleAuthError(kind)` — but only when a token was actually sent — before
//     we rethrow (React Query / callers still see the original error). This
//     matches `useSurveyQuery`/`useSurveyMutation`.
//   • transformIncoming/transformOutgoing, `skipFetching`/enabled gating,
//     `initialLoading`, summary-invalidation on update, operator-invalidation on
//     delete, `invalidateOnMutate`, and the `{ data, error, isLoading,
//     initialLoading, mutate, remove }` return shape are all preserved.
//   • `update`/`remove` are optional (a resource may be read-only or have no
//     delete). `mutate(undefined)` still just invalidates the query.

type GetArgs = {
  nodeOperatorId: OperatorKey;
  token?: string;
  signal?: AbortSignal;
};

type MutateArgs = {
  nodeOperatorId: OperatorKey;
  token?: string;
};

type UseOperatorSurveyOptions<T, R> = {
  operatorKey?: OperatorKey;
  skipFetching?: boolean;
  transformIncoming?: (d: R) => T;
  transformOutgoing?: (d: T) => R;
  invalidateOnMutate?: boolean;
  // Nullable single-resource endpoints resolve `null` for "not yet submitted";
  // the query below normalizes that to `undefined` so callers don't repeat it.
  get: (args: GetArgs) => Promise<R | null | undefined>;
  update?: (payload: R, args: MutateArgs) => Promise<R | undefined>;
  remove?: (args: MutateArgs) => Promise<void>;
};

export const useOperatorSurvey = <T, R = T>(
  pathKey: string,
  opts: UseOperatorSurveyOptions<T, R>,
) => {
  const { token, handleAuthError } = useSiweAuth();
  const queryClient = useQueryClient();
  const connectedKey = useOperatorKey();
  const effectiveKey = opts.operatorKey ?? connectedKey;

  const {
    transformIncoming,
    transformOutgoing,
    invalidateOnMutate,
    get,
    update,
    remove: removeThunk,
  } = opts;

  const queryKey = useMemo<readonly unknown[]>(
    () =>
      withAuthToken(
        effectiveKey
          ? surveysKeys.path(effectiveKey, pathKey)
          : surveysKeys.pending(pathKey),
        token,
      ),
    [effectiveKey, pathKey, token],
  );

  // Mirrors the old `requireUrl` invariant: a request must never fire without an
  // operator key. The `enabled` gate below already prevents this for the query;
  // the invariant narrows `effectiveKey` to a non-undefined `OperatorKey` for the
  // thunks and guards the mutation paths.
  const requireKey = useCallback((): OperatorKey => {
    invariant(effectiveKey, 'useOperatorSurvey: operator key is not available');
    return effectiveKey;
  }, [effectiveKey]);

  // Reproduce the transport's old onAuthError dispatch around every operation.
  const withAuthErrorDispatch = useCallback(
    async <V>(run: () => Promise<V>): Promise<V> => {
      try {
        return await run();
      } catch (error) {
        dispatchAuthError(error, token, handleAuthError);
        throw error;
      }
    },
    [token, handleAuthError],
  );

  const query = useQuery<T>({
    queryKey,
    queryFn: ({ signal }) =>
      withAuthErrorDispatch(async () => {
        const res =
          (await get({ nodeOperatorId: requireKey(), token, signal })) ??
          undefined;
        return res && transformIncoming
          ? transformIncoming(res)
          : (res as unknown as T);
      }),
    enabled: !opts.skipFetching && effectiveKey !== undefined && !!token,
    ...STRATEGY_LAZY,
  });

  const updateMutation = useMutation({
    mutationFn: (data: T): Promise<T> =>
      withAuthErrorDispatch(async () => {
        invariant(update, 'useOperatorSurvey: update is not available');
        const payload = transformOutgoing
          ? transformOutgoing(data)
          : (data as unknown as R);
        const res = await update(payload, {
          nodeOperatorId: requireKey(),
          token,
        });
        return res && transformIncoming
          ? transformIncoming(res)
          : (res as unknown as T);
      }),
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
    mutationFn: (): Promise<void> =>
      withAuthErrorDispatch(async () => {
        invariant(removeThunk, 'useOperatorSurvey: remove is not available');
        await removeThunk({ nodeOperatorId: requireKey(), token });
      }),
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
