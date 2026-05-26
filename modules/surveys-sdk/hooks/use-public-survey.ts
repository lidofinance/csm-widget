import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { STRATEGY_LAZY } from 'consts';
import { surveysGet } from '../api/surveys-api';
import { surveysKeys } from './query-keys';

// Public GET wrapper — no token, callable from any context (no SiweAuthProvider needed).
export const usePublicSurvey = <T>(path: string | null): UseQueryResult<T> => {
  return useQuery<T>({
    queryKey: surveysKeys.public(path ?? ''),
    queryFn: ({ signal }) => surveysGet<T>(path as string, { signal }),
    enabled: Boolean(path),
    ...STRATEGY_LAZY,
  });
};
