import { useCallback } from 'react';

import { API_ROUTES } from 'consts/api';

import { SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { useUserConfig } from '../user-config';

export const getBackendRPCPath = (chainId: string | number): string => {
  const BASE_URL = typeof window === 'undefined' ? '' : window.location.origin;
  return `${BASE_URL}/${API_ROUTES.RPC}?chainId=${chainId}`;
};

export const useGetRpcUrlByChainId = () => {
  const userConfig = useUserConfig();

  return useCallback(
    (chainId: SUPPORTED_CHAINS) => {
      // We always need Mainnet RPC for some requests, e.g. ETH to USD price, ENS lookup.
      if (chainId !== CHAINS.Mainnet && chainId !== userConfig.defaultChain) {
        // Has no effect on functionality. Just a fix.
        // Return empty string as a stub
        return '';
      }

      return (
        userConfig.savedUserConfig.rpcUrls[chainId] ||
        getBackendRPCPath(chainId)
      );
    },
    [userConfig],
  );
};
