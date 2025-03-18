import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useSDK } from '@lido-sdk/react';

import { CHAINS } from 'consts/chains';
import { API_ROUTES } from 'consts/api';

// Don't use absolute import here!
// code'''
//    import { config } from 'config';
// '''
// otherwise you will get something like a cyclic error!
import { config } from '../get-config';

import { useUserConfig } from '../user-config';

export const getBackendApiPath = (chainId: string | number): string => {
  const BASE_URL = typeof window === 'undefined' ? '' : window.location.origin;
  return `${BASE_URL}/${API_ROUTES.CL}/${chainId}`;
};

export const useGetClApiUrlByChainId = () => {
  const userConfig = useUserConfig();

  return useCallback(
    (chainId: CHAINS) => {
      // This condition is needed because in 'providers/web3.tsx' we add `wagmiChains.polygonMumbai` to supportedChains as a workaround.
      // polygonMumbai (80001) may cause an invariant throwing.
      if (!userConfig.supportedChainIds.includes(chainId)) {
        // Has no effect on functionality. Just a fix.
        // Return empty string as a stub
        // (see: 'providers/web3.tsx' --> jsonRpcBatchProvider --> getStaticRpcBatchProvider)
        // TODO: check this
        return '';
      }

      if (config.ipfsMode) {
        const apiUrl = userConfig.savedUserConfig.clApiUrls[chainId];

        invariant(apiUrl, '[useGetClApiUrlByChainId] ApiUrl is required!');
        return apiUrl;
      } else {
        return (
          userConfig.savedUserConfig.clApiUrls[chainId] ||
          getBackendApiPath(chainId)
        );
      }
    },
    [userConfig],
  );
};

export const useClApiUrl = () => {
  const { chainId } = useSDK();
  return useGetClApiUrlByChainId()(chainId as number);
};
