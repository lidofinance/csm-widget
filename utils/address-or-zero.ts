import { isAddress, zeroAddress } from 'viem';

export const addressOrZero = (address?: string | false) => {
  return address && isAddress(address) ? address : zeroAddress;
};
