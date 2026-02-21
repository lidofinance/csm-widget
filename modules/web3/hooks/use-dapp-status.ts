import { SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { useUserConfig } from 'config/user-config';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

type Result = {
  chainId: SUPPORTED_CHAINS;
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

  const { defaultChain: chainId } = useUserConfig();

  const isSupportedChain = walletChainId ? walletChainId === chainId : true;

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
