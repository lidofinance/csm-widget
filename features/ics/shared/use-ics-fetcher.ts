import { useCallback } from 'react';
import { useExternalLinks } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { FetcherError, standardFetcher } from 'utils';
import { useAuth } from './ics-auth-provider';

export const useIcsFetcher = <T, R = T>() => {
  const { surveyApi } = useExternalLinks();
  const { token, logout } = useAuth();

  const handleError = useCallback(
    (err: unknown) => {
      const error = err as FetcherError;
      if (error?.status === 401 || error.status === 403) {
        logout();
      }
    },
    [logout],
  );

  const fetcher = useCallback(
    async (url: string) => {
      invariant(token, 'Token is not available');
      try {
        const res = await standardFetcher<R>(`${surveyApi}/${url}`, {
          headers: {
            'Content-type': 'application/json',
            Authorization: token,
          },
        });
        return res;
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
    [handleError, surveyApi, token],
  );

  const updater = useCallback(
    (url: string, data: T | null) => async () => {
      invariant(token, 'Token is not available');
      try {
        const res = await standardFetcher<R>(`${surveyApi}/${url}`, {
          method: data === null ? 'DELETE' : 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-type': 'application/json',
            Authorization: token,
          },
        });
        return res;
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
    [handleError, surveyApi, token],
  );

  return [fetcher, updater] as const;
};
