import { debounce } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { Address, isAddress } from 'viem';
import { usePublicClient } from 'wagmi';

const ENS_REGEX = new RegExp('^[-a-zA-Z0-9@._]{1,256}.eth$');
const isValidEns = (ens: string) => ENS_REGEX.test(ens);

export type AddressResolutionResult = {
  value?: string;
  ens?: boolean;
};

export type UseAddressResolutionReturn = {
  address: AddressResolutionResult;
  isLoading: boolean;
  resolveAddress: (value: string) => void;
};

export const useAddressResolution = (): UseAddressResolutionReturn => {
  const [address, setAddress] = useState<AddressResolutionResult>({});
  const [isLoading, setIsLoading] = useState(false);
  const client = usePublicClient();

  const getEnsAddress = useCallback(
    async (value: string) => {
      let result: Address | undefined | null = undefined;

      try {
        setIsLoading(true);
        result = await client?.getEnsAddress({ name: value });
      } catch (error) {
        console.error(value);
      } finally {
        setIsLoading(false);
      }

      return result;
    },
    [client],
  );

  const resolveAddress = useMemo(
    () =>
      debounce(async (value: string) => {
        if (value && isValidEns(value)) {
          const result = await getEnsAddress(value);
          setAddress({ value: result ?? '', ens: true });
        } else if (isAddress(value)) {
          setAddress({ value });
        } else if (value) {
          setAddress({ value: '' });
        } else {
          setAddress({ value: undefined });
        }
      }, 200),
    [getEnsAddress],
  );

  return {
    address,
    isLoading,
    resolveAddress,
  };
};
