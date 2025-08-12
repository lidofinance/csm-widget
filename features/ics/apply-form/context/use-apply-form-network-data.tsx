import { useMemo } from 'react';
import { useDappStatus } from 'modules/web3';
import type { ApplyFormNetworkData } from './types';

export const useApplyFormNetworkData = (): [ApplyFormNetworkData, () => void] => {
  const { address, isConnected, loading } = useDappStatus();

  const networkData = useMemo((): ApplyFormNetworkData => ({
    connectedAddress: isConnected ? address : undefined,
    loading: {
      connectedAddress: loading,
    },
  }), [address, isConnected, loading]);

  const revalidate = () => {
    // Network data revalidation if needed
    // Currently handled by useDappStatus internally
  };

  return [networkData, revalidate];
};