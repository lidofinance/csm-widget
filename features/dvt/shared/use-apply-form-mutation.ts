import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useCallback } from 'react';
import { DvtApplyDto, DvtResponseDto } from './types';
import { useDvtFetcher } from './use-dvt-fetcher';

export const useApplyFormMutation = (
  options: Pick<
    UseMutationOptions<DvtResponseDto, Error, DvtApplyDto, unknown>,
    'onMutate' | 'onError' | 'onSuccess'
  > = {},
) => {
  const [, updater] = useDvtFetcher<DvtApplyDto, DvtResponseDto>();

  return useMutation({
    ...options,
    mutationKey: ['dvt-apply'],
    mutationFn: useCallback(
      async (payload: DvtApplyDto) => {
        return await updater('dvt/apply', payload)();
      },
      [updater],
    ),
  });
};
