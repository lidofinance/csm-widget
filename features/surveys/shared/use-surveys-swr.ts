import useSWR from 'swr';
import { useSurveysFetcher } from './use-surveys-fetcher';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback } from 'react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';

export const useSurveysSWR = <T>(path: string) => {
  const nodeOperatorId = useNodeOperatorId();
  const url = `${nodeOperatorId}/${path}`;

  const [fetcher, updater] = useSurveysFetcher();
  const swr = useSWR<T>(url, fetcher, STRATEGY_LAZY);

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
    return swr.mutate(updater<T>(url, null), {
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
