import useSWR from 'swr';
import { useSurveysFetcher } from './use-surveys-fetcher';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback } from 'react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';

type Options<T, R> = {
  skipFetching?: boolean;
  transformIncoming?: (d: R) => T;
  transformOutcoming?: (d: T) => R;
};

export const useSurveysSWR = <T, R = T>(
  path: string,
  options?: Options<T, R>,
) => {
  const nodeOperatorId = useNodeOperatorId();
  const url = `${nodeOperatorId}/${path}`;

  const [fetcher, updater] = useSurveysFetcher<T, R>(
    options?.transformIncoming,
    options?.transformOutcoming,
  );
  const swr = useSWR<T>(
    url,
    options?.skipFetching ? null : fetcher,
    STRATEGY_LAZY,
  );

  const mutate = useCallback(
    (data: T) => {
      return swr.mutate(updater(url, data), {
        rollbackOnError: true,
        revalidate: false,
      });
    },
    [swr, updater, url],
  );

  const remove = useCallback(() => {
    return swr.mutate(updater(url, null), {
      rollbackOnError: true,
      revalidate: false,
    });
  }, [swr, updater, url]);

  return {
    ...swr,
    mutate,
    remove,
  };
};
