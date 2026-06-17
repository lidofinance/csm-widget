import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { STRATEGY_LAZY } from 'consts';
import { useSiweAuth } from 'modules/siwe';
import { useDappStatus } from 'modules/web3';
import { useMemo } from 'react';
import { authErrorKindFromCode } from '../api/errors';
import { surveysGet } from '../api/surveys-api';
import { surveysKeys } from './query-keys';

type StaleStrategy = {
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  refetchInterval?: number | false;
};

type UseSurveysQueryOptions<T, S = T> = {
  enabled?: boolean;
  queryKey?: readonly unknown[];
  select?: (d: T) => S;
  staleStrategy?: StaleStrategy;
};

export const useSurveysQuery = <T, S = T>(
  path: string,
  opts: UseSurveysQueryOptions<T, S> = {},
): UseQueryResult<S> => {
  const { token, handleAuthError } = useSiweAuth();
  const { address } = useDappStatus();

  // Append the token as the LAST key segment so a re-auth (AUTH_JWT_EXPIRED →
  // signIn sets a new token VALUE, same path/address) produces a new key and
  // React Query refetches — there is no refresh endpoint to retry the errored
  // query in place. Trailing position preserves prefix-based invalidation
  // (mutations invalidating by authPath still match).
  const queryKey = useMemo<readonly unknown[]>(() => {
    const base = opts.queryKey ?? surveysKeys.authPath(path, address);
    return token ? [...base, token] : base;
  }, [opts.queryKey, path, address, token]);

  const enabled = opts.enabled !== undefined ? opts.enabled : !!token;
  const strategy = opts.staleStrategy ?? STRATEGY_LAZY;

  return useQuery<T, Error, S>({
    queryKey,
    queryFn: ({ signal }) =>
      surveysGet<T>(path, {
        token,
        onAuthError: (code) => handleAuthError(authErrorKindFromCode(code)),
        signal,
      }),
    enabled,
    select: opts.select,
    ...strategy,
  });
};
