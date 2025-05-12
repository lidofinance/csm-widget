import { useDappStatus } from 'modules/web3';
import { useMemo } from 'react';
import { useAccount as useWagmiAccount } from 'wagmi';

// TODO: remove this hook when all usages are replaced with useDappStatus
export const useAccount = () => {
  const { isConnected, isConnecting } = useWagmiAccount();

  const { address, chainId, isSupportedChain, isAccountActive } =
    useDappStatus();

  const isUnsupported = !isSupportedChain;

  return useMemo(
    () => ({
      chainId,
      address,
      active: isAccountActive,
      isConnected,
      isUnsupported,
      isConnecting,
    }),
    [
      address,
      chainId,
      isAccountActive,
      isConnected,
      isConnecting,
      isUnsupported,
    ],
  );
};
