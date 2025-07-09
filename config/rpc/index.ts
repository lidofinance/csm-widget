import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { API_ROUTES } from 'consts/api';

// Don't use absolute import here!
// code'''
//    import { config } from 'config';
// '''
// otherwise you will get something like a cyclic error!
import { config } from '../get-config';

import { CSM_SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { useUserConfig } from '../user-config';

export const getBackendRPCPath = (chainId: string | number): string => {
  const BASE_URL = typeof window === 'undefined' ? '' : window.location.origin;
  return `${BASE_URL}/${API_ROUTES.RPC}?chainId=${chainId}`;
};

export const useGetRpcUrlByChainId = () => {
  const userConfig = useUserConfig();

  return useCallback(
    (chainId: CSM_SUPPORTED_CHAINS) => {
      // We always need Mainnet RPC for some requests, e.g. ETH to USD price, ENS lookup.
      if (
        chainId !== CHAINS.Mainnet &&
        !userConfig.supportedChainIds.includes(chainId)
      ) {
        // Has no effect on functionality. Just a fix.
        // Return empty string as a stub
        return '';
      }

      if (config.ipfsMode) {
        const rpc =
          userConfig.savedUserConfig.rpcUrls[chainId] ||
          userConfig.prefillUnsafeElRpcUrls[chainId]?.[0];

        invariant(rpc, '[useGetRpcUrlByChainId] RPC is required!');
        return rpc;
      } else {
        return (
          userConfig.savedUserConfig.rpcUrls[chainId] ||
          getBackendRPCPath(chainId)
        );
      }
    },
    [userConfig],
  );
};
