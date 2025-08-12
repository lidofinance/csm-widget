import { useMemo } from 'react';
import type { ApplyFormInputType, ApplyFormNetworkData } from './types';

export const useGetDefaultValues = (
  networkData: ApplyFormNetworkData,
): ApplyFormInputType => {
  return useMemo((): ApplyFormInputType => ({
    mainAddress: networkData.connectedAddress || '',
    additionalAddresses: [],
    socialProof: {
      twitter: '',
      discord: '',
    },
  }), [networkData.connectedAddress]);
};