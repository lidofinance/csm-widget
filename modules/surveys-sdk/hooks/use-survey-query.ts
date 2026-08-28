import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { STRATEGY_LAZY } from 'consts';
import { useSiweAuth } from 'modules/siwe';
import { useMemo } from 'react';
import { dispatchAuthError } from '../api/errors';
import { withAuthToken } from './query-keys';

// Thunk-based successor to `useSurveysQuery`. Instead of a path string + the old
// `surveysGet` transport, the caller supplies `makeRequest` — a thunk that runs
// a generated SDK call through `callSurvey` (e.g.
// `({ token, signal }) => callSurvey(() => icsGetStatus(surveyRequest(token, signal)))`).
//
// Parity with the old hook is deliberate so the two coexist during migration:
//   • Token + auth-error callback come from `useSiweAuth()`.
//   • Query key: the caller passes a BASE key (what the old hook built via
//     `surveysKeys.authPath(path, address)`); we append the token internally
//     with `withAuthToken` so cache identity / invalidation match exactly.
//   • `enabled` defaults to `!!token`; `select` and `staleStrategy` mirror the
//     old options (`staleStrategy ?? STRATEGY_LAZY`).
//   • onAuthError: the old transport fired `onAuthError(kind)` on auth failures,
//     but only when a token was actually sent. The configured survey client no
//     longer does this, so we reproduce it via `dispatchAuthError` (which keeps
//     that token guard) before rethrowing (React Query still sees the original
//     error).

type StaleStrategy = {
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  refetchInterval?: number | false;
};

type SurveyRequestArgs = {
  token?: string;
  signal?: AbortSignal;
};

type UseSurveyQueryOptions<T, S = T> = {
  enabled?: boolean;
  select?: (d: T) => S;
  staleStrategy?: StaleStrategy;
};

export const useSurveyQuery = <T, S = T>(
  baseQueryKey: readonly unknown[],
  makeRequest: (args: SurveyRequestArgs) => Promise<T | undefined>,
  opts: UseSurveyQueryOptions<T, S> = {},
): UseQueryResult<S> => {
  const { token, handleAuthError } = useSiweAuth();

  const queryKey = useMemo<readonly unknown[]>(
    () => withAuthToken(baseQueryKey, token),
    [baseQueryKey, token],
  );

  const enabled = opts.enabled !== undefined ? opts.enabled : !!token;
  const strategy = opts.staleStrategy ?? STRATEGY_LAZY;

  return useQuery<T, Error, S>({
    queryKey,
    queryFn: async ({ signal }) => {
      try {
        return (await makeRequest({ token, signal })) as T;
      } catch (error) {
        // Render-driven read: never pop the signature modal on page visit.
        dispatchAuthError(error, token, handleAuthError, {
          interactive: false,
        });
        throw error;
      }
    },
    enabled,
    select: opts.select,
    ...strategy,
  });
};
