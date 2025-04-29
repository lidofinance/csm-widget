import { useLidoSWR, useSDK } from '@lido-sdk/react';
import { STRATEGY_IMMUTABLE } from 'consts/swr-strategies';
import { Address } from 'wagmi';

export const useEnsName = (address?: Address) => {
  const { providerRpc } = useSDK();
  return useLidoSWR(
    ['ens-name', address],
    address ? () => providerRpc.lookupAddress(address) : null,
    STRATEGY_IMMUTABLE,
  );
};

export const useEnsAvatar = (name?: string) => {
  const { providerRpc } = useSDK();
  return useLidoSWR(
    ['ens-avatar', name],
    name ? () => providerRpc.getAvatar(name) : null,
    STRATEGY_IMMUTABLE,
  );
};
