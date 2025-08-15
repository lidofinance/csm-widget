import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useCallback } from 'react';
import { IcsApplyDto, IcsResponseDto } from './types';
import { useIcsFetcher } from './use-ics-fetcher';

export const useApplyFormMutation = (
  options: Pick<
    UseMutationOptions<IcsResponseDto, Error, IcsApplyDto, unknown>,
    'onMutate' | 'onError' | 'onSuccess'
  > = {},
) => {
  const [, updater] = useIcsFetcher<IcsApplyDto, IcsResponseDto>();

  return useMutation({
    ...options,
    mutationKey: ['ics-apply'],
    mutationFn: useCallback(
      async (payload: IcsApplyDto) => {
        return await updater('ics/apply', payload)();
      },
      [updater],
    ),
  });
};
