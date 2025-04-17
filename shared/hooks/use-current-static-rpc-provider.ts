import { useMemo } from 'react';
import { useSDK } from '@lido-sdk/react';
import { CHAINS } from '@lido-sdk/constants';

import { useRpcUrl } from 'config/rpc';
import { getStaticRpcBatchProvider } from 'utils/getStaticRpcBatchProvider';

export const useCurrentStaticRpcProvider = (): {
  staticRpcProvider: ReturnType<typeof getStaticRpcBatchProvider>;
  chainId: CHAINS;
} => {
  const { chainId } = useSDK();
  const rpcUrl = useRpcUrl();

  const staticRpcProvider = useMemo(() => {
    return getStaticRpcBatchProvider(chainId, rpcUrl);
  }, [chainId, rpcUrl]);

  return {
    staticRpcProvider,
    chainId,
  };
};
