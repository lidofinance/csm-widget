import { CSM_SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { useUserConfig } from 'config/user-config';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

type Result = {
  chainId: CSM_SUPPORTED_CHAINS;
  isSupportedChain: boolean;
  isAccountActive: boolean;
  isWalletConnected: boolean;
  address?: Address;
};

export const useDappStatus = (): Result => {
  const {
    address: walletAddress,
    chainId: walletChainId,
    isConnected: isWalletConnected,
  } = useAccount();

  const { supportedChainIds, defaultChain: defaultChainId } = useUserConfig();

  const chainId = (
    walletChainId && supportedChainIds.includes(walletChainId)
      ? walletChainId
      : defaultChainId
  ) as CSM_SUPPORTED_CHAINS;

  const isSupportedChain = walletChainId
    ? supportedChainIds.includes(walletChainId)
    : true;

  const isAccountActive = walletChainId
    ? isWalletConnected && isSupportedChain
    : false;

  const address = isSupportedChain ? walletAddress : undefined;

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
