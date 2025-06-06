import { useUserConfig } from 'config/user-config';
import { CHAINS } from 'consts';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

type Result = {
  chainId: CHAINS;
  isSupportedChain: boolean;
  isAccountActive: boolean;
  isWalletConnected: boolean;
  address?: Address;
};

export const useDappStatus = (): Result => {
  const {
    address,
    chainId: walletChainId,
    isConnected: isWalletConnected,
  } = useAccount();

  const { supportedChainIds, defaultChain: defaultChainId } = useUserConfig();

  const chainId = (
    walletChainId && supportedChainIds.includes(walletChainId)
      ? walletChainId
      : defaultChainId
  ) as CHAINS;

  const isSupportedChain = walletChainId
    ? supportedChainIds.includes(walletChainId)
    : true;

  const isAccountActive = walletChainId
    ? isWalletConnected && isSupportedChain
    : false;

  // no useMemo because memoisation is more expensive than boolean flags
  // hook is used in many places and every usage would create separate memoisation
  return {
    chainId,
    isSupportedChain,
    isAccountActive,
    isWalletConnected,
    address,
  };
};
