import { useDappStatus } from 'modules/web3';
import type { ApplyFormNetworkData } from './types';
import { Address } from 'viem';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { ICS_FORM_STATUS_KEY } from 'features/ics/shared';

const generateSocialMessage = (
  address: Address,
  platform: 'twitter' | 'discord',
) => {
  const baseMessage = `This post is proof that I am the owner of this ${platform === 'twitter' ? 'X' : 'Discord'} account. My address to get verified for ICS: ${address.toLowerCase()}`;
  return baseMessage;
};

export const generateAddressMessage = (address: Address) =>
  `Verify ownership of address for ICS: ${address.toLowerCase()}`;

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
      twitterMessage: address ? generateSocialMessage(address, 'twitter') : '',
      discordMessage: address ? generateSocialMessage(address, 'discord') : '',
    },
    revalidate,
  ];
};
