import { Address } from 'wagmi';

export const generateSocialMessage = (
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
