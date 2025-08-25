import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useCallback } from 'react';
import useSWR from 'swr';
import { IcsApplyDto, IcsResponseDto } from './types';
import { useIcsFetcher } from './use-ics-fetcher';

export const ICS_FORM_STATUS_KEY = 'ics-form-status';

export const useFormStatus = () => {
  const [fetcher, updater] = useIcsFetcher<IcsApplyDto, IcsResponseDto>();

  const swr = useSWR('ics/status', fetcher, STRATEGY_LAZY);

  const mutate = useCallback(
    async (payload: IcsApplyDto) =>
      swr.mutate(updater('ics/apply', payload), {
        rollbackOnError: true,
        revalidate: false,
      }),
    [swr, updater],
  );

  return {
    ...swr,
    mutate,
  };
};
