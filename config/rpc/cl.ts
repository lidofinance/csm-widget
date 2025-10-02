import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { API_ROUTES } from 'consts/api';

// Don't use absolute import here!
// code'''
//    import { config } from 'config';
// '''
// otherwise you will get something like a cyclic error!
import { config } from '../get-config';
import { useUserConfig } from '../user-config';

import { useDappStatus } from 'modules/web3';
import { CSM_SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';

export const getBackendApiPath = (chainId: string | number): string => {
  const BASE_URL = typeof window === 'undefined' ? '' : window.location.origin;
  return `${BASE_URL}/${API_ROUTES.CL}/${chainId}`;
};

export const useGetClApiUrlByChainId = () => {
  const userConfig = useUserConfig();

  return useCallback(
    (chainId: CSM_SUPPORTED_CHAINS) => {
      if (!userConfig.supportedChainIds.includes(chainId)) {
        // Has no effect on functionality. Just a fix.
        // Return empty string as a stub
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
  const { chainId } = useDappStatus();
  return useGetClApiUrlByChainId()(chainId);
};
