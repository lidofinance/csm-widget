import { useMemo } from 'react';

import { useGetRpcUrlByChainId } from 'config/rpc';
import { CHAINS } from 'consts/chains';
import { getStaticRpcBatchProvider } from 'utils';

// @note unused
export const useMainnetStaticRpcProvider = () => {
  const getRpcUrl = useGetRpcUrlByChainId();
  return useMemo(() => {
    return getStaticRpcBatchProvider(1, getRpcUrl(CHAINS.Mainnet));
  }, [getRpcUrl]);
};
