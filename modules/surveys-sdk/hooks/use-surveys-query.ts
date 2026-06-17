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

  const queryKey = useMemo<readonly unknown[]>(
    () => opts.queryKey ?? surveysKeys.authPath(path, address),
    [opts.queryKey, path, address],
  );

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
