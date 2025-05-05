import { useLidoSWR, useLocalStorage, useSDK } from '@lido-sdk/react';
import { STRATEGY_IMMUTABLE } from 'consts/swr-strategies';
import { Address } from 'wagmi';
import { useMergeSwr } from './useMergeSwr';
import { useEffect } from 'react';

export const useEnsName = (address?: Address) => {
  const [storedValue, setStoredValue] = useLocalStorage<string | null>(
    `ens-${address}`,
    null,
  );
  const { providerRpc } = useSDK();

  const swrEns = useLidoSWR(
    ['ens-name', address],
    address ? () => providerRpc.lookupAddress(address) : null,
    STRATEGY_IMMUTABLE,
  );

  useEffect(() => {
    if (swrEns.data !== undefined) {
      setStoredValue(swrEns.data);
    }
  }, [setStoredValue, swrEns.data]);

  return useMergeSwr([swrEns], storedValue);
};

export const useEnsAvatar = (name?: string) => {
  const { providerRpc } = useSDK();
  return useLidoSWR(
    ['ens-avatar', name],
    name ? () => providerRpc.getAvatar(name) : null,
    STRATEGY_IMMUTABLE,
  );
};
