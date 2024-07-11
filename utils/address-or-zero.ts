import { AddressZero } from '@ethersproject/constants';
import { isAddress } from 'ethers/lib/utils.js';

export const addressOrZero = (address?: string) => {
  return address && isAddress(address) ? address : AddressZero;
};
