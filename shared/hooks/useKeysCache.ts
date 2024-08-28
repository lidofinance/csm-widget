import { useSDK } from '@lido-sdk/react';
import { useCallback, useMemo } from 'react';
import { removeKeys, saveKeys } from 'shared/keys/cachedKeys';

export const useKeysCache = () => {
  const { chainId, providerRpc } = useSDK(); // FIXME: drop sdk

  const addCacheKeys = useCallback(
    async (publicKeys: string[]) => {
      const currentBlock = await providerRpc.getBlockNumber();
      saveKeys(publicKeys, chainId, currentBlock);
    },
    [chainId, providerRpc],
  );

  const removeCacheKeys = useCallback(
    async (publicKeys: string[]) => {
      const currentBlock = await providerRpc.getBlockNumber();
      removeKeys(publicKeys, chainId, currentBlock);
    },
    [chainId, providerRpc],
  );

  return useMemo(
    () => ({
      addCacheKeys,
      removeCacheKeys,
    }),
    [addCacheKeys, removeCacheKeys],
  );
};
