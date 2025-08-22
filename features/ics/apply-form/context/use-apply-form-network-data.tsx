import { useAccount } from 'shared/hooks';
import type { ApplyFormNetworkData } from './types';
import { Address } from 'wagmi';
import { useCallback } from 'react';

const generateSocialMessage = (
  address: Address,
  platform: 'twitter' | 'discord',
) => {
  return `This post is proof that I am the owner of this ${platform === 'twitter' ? 'X' : 'Discord'} account. My address to get verified for ICS: ${address.toLowerCase()}`;
};

export const generateAddressMessage = (
  address: Address,
  mainAddress: Address,
) =>
  `Verify ownership of address ${address.toLowerCase()} for ICS with main address ${mainAddress.toLowerCase()}`;

export const useApplyFormNetworkData = (): [
  ApplyFormNetworkData,
  () => void,
] => {
  const { address } = useAccount();

  const revalidate = useCallback(() => {}, []);

  return [
    {
      mainAddress: address || ('0x0' as Address),
      twitterMessage: address ? generateSocialMessage(address, 'twitter') : '',
      discordMessage: address ? generateSocialMessage(address, 'discord') : '',
    },
    revalidate,
  ];
};
