import { useAccount as useWagmiAccount, useNetwork } from 'wagmi';

export const useAccount = (_key?: string) => {
  const { address, isConnected, isConnecting } = useWagmiAccount();
  const { chain } = useNetwork();
  const isUnsupported = !!chain?.unsupported;

  return {
    chainId: isUnsupported ? undefined : chain?.id,
    address: !isUnsupported && isConnected ? address : undefined,
    active: !isUnsupported && isConnected,
    isConnected,
    isUnsupported,
    isConnecting,
  };
};
