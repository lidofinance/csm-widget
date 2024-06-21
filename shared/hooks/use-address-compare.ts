import { useCallback } from 'react';
import { useAccount } from './use-account';
import { addressCompare } from 'utils';

export const useAddressCompare = () => {
  const { address } = useAccount();

  return useCallback(
    (value?: string) => addressCompare(address, value),
    [address],
  );
};
