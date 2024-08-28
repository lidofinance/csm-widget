import { useCallback } from 'react';
import { useAccount } from './use-account';
import { compareLowercase } from 'utils';
import { AddressZero } from '@ethersproject/constants';

export const useAddressCompare = (allowAddressZero = false) => {
  const { address } = useAccount();

  return useCallback(
    (value?: string) =>
      compareLowercase(address, value) ||
      (allowAddressZero && value === AddressZero),
    [address, allowAddressZero],
  );
};
