import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { FetcherError, standardFetcher } from 'utils';
import { useAuth } from './survey-auth-provider';
import { getExternalLinks } from 'consts/external-links';

const { surveyApi } = getExternalLinks();

export const useSurveysFetcher = <T, R = T>(
  transformIncoming?: (d: R) => T,
  transformOutcoming?: (d: T) => R,
) => {
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
        return res && transformIncoming ? transformIncoming(res) : (res as T);
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
    [handleError, token, transformIncoming],
  );

  const updater = useCallback(
    (url: string, data: T | null) => async () => {
      invariant(token, 'Token is not available');
      try {
        const res = await standardFetcher<R>(`${surveyApi}/${url}`, {
          method: data === null ? 'DELETE' : 'POST',
          body: JSON.stringify(
            data && transformOutcoming ? transformOutcoming(data) : data,
          ),
          headers: {
            'Content-type': 'application/json',
            Authorization: token,
          },
        });
        return res && transformIncoming ? transformIncoming(res) : (res as T);
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
    [handleError, token, transformIncoming, transformOutcoming],
  );

  return [fetcher, updater] as const;
};
