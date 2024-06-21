import { useMemo } from 'react';
import { useAccount as useWagmiAccount, useNetwork } from 'wagmi';

// TODO: _key ???
export const useAccount = (_key?: string) => {
  const { address, isConnected, isConnecting } = useWagmiAccount();
  const { chain } = useNetwork();
  const isUnsupported = !!chain?.unsupported;

  return useMemo(
    () => ({
      chainId: isUnsupported ? undefined : chain?.id,
      address: !isUnsupported && isConnected ? address : undefined,
      active: !isUnsupported && isConnected,
      isConnected,
      isUnsupported,
      isConnecting,
    }),
    [address, chain?.id, isConnected, isConnecting, isUnsupported],
  );
};
