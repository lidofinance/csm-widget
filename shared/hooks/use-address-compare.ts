import { useCallback } from 'react';
import { useAccount } from './use-account';
import { compareLowercase } from 'utils';

export const useAddressCompare = () => {
  const { address } = useAccount();

  return useCallback(
    (value?: string) => compareLowercase(address, value),
    [address],
  );
};
