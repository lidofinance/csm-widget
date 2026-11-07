import { useCallback } from 'react';

import { API_ROUTES } from 'consts/api';

import { SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { getApiUrl } from 'shared/hooks/get-api-url';
import { useUserConfig } from '../user-config';

export const getBackendRPCPath = (chainId: string | number): string => {
  return getApiUrl(API_ROUTES.RPC, { chainId: String(chainId) });
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
