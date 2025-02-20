import { getConfig } from 'config';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { FetcherError, standardFetcher } from 'utils';
import { useAuth } from './survey-auth-provider';

const { surveyApi } = getConfig();

export const useSurveysFetcher = () => {
  const { token, logout } = useAuth();

  const handleError = useCallback(
    (err: unknown) => {
      const error = err as FetcherError;
      if (error?.status === 401) {
        logout();
      }
    },
    [logout],
  );

  const fetcher = useCallback(
    async <T>(url: string) => {
      invariant(token, 'Token is not available');
      try {
        return standardFetcher<T>(`${surveyApi}/${url}`, {
          headers: {
            'Content-type': 'application/json',
            Authorization: token,
          },
        });
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
    [handleError, token],
  );

  const updater = useCallback(
    <T>(url: string, data: T | null) =>
      async () => {
        invariant(token, 'Token is not available');
        try {
          return standardFetcher<T>(`${surveyApi}/${url}`, {
            method: data === null ? 'DELETE' : 'POST',
            body: JSON.stringify(data),
            headers: {
              'Content-type': 'application/json',
              Authorization: token,
            },
          });
        } catch (err) {
          handleError(err);
          throw err;
        }
      },
    [handleError, token],
  );

  return [fetcher, updater] as const;
};
