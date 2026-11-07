import { useCallback } from 'react';

import { API_ROUTES } from 'consts/api';

import { getApiUrl } from 'shared/hooks/get-api-url';
import { useUserConfig } from '../user-config';

import { useDappStatus } from 'modules/web3';
import { SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';

export const getBackendApiPath = (chainId: string | number): string => {
  return getApiUrl(`${API_ROUTES.CL}/${chainId}`);
};

export const useGetClApiUrlByChainId = () => {
  const userConfig = useUserConfig();

  return useCallback(
    (chainId: SUPPORTED_CHAINS) => {
      if (chainId !== userConfig.defaultChain) {
        // Has no effect on functionality. Just a fix.
        // Return empty string as a stub
        return '';
      }

      return (
        userConfig.savedUserConfig.clApiUrls[chainId] ||
        getBackendApiPath(chainId)
      );
    },
    [userConfig],
  );
};

export const useClApiUrl = () => {
  const { chainId } = useDappStatus();
  return useGetClApiUrlByChainId()(chainId);
};
