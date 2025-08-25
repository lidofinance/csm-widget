import { useCallback } from 'react';
import { useAccount } from 'shared/hooks';
import { Address } from 'wagmi';
import type { ApplyFormNetworkData } from './types';

export const useApplyFormNetworkData = (): [
  ApplyFormNetworkData,
  () => void,
] => {
  const { address } = useAccount();

  const revalidate = useCallback(() => {}, []);

  return [
    {
      mainAddress: address || ('0x0' as Address),
    },
    revalidate,
  ];
};
