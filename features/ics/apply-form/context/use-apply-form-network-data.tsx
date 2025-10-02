import { useQueryClient } from '@tanstack/react-query';
import { ICS_FORM_STATUS_KEY } from 'features/ics/shared';
import { useDappStatus } from 'modules/web3';
import { useCallback } from 'react';
import { Address } from 'viem';
import type { ApplyFormNetworkData } from './types';

export const useApplyFormNetworkData = (): [
  ApplyFormNetworkData,
  () => void,
] => {
  const { address } = useDappStatus();

  const queryClient = useQueryClient();

  const revalidate = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: [ICS_FORM_STATUS_KEY],
    });
  }, [queryClient]);

  return [
    {
      mainAddress: address || ('0x0' as Address),
    },
    revalidate,
  ];
};
