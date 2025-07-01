import { getBlockNumber } from '@wagmi/core';
import { useDappStatus } from 'modules/web3';
import { useCallback, useMemo } from 'react';
import { removeKeys, saveKeys } from 'shared/keys/cachedKeys';
import { useConfig } from 'wagmi';

// FIXME: refactor
export const useKeysCache = () => {
  const { chainId } = useDappStatus();
  const config = useConfig();

  const addCacheKeys = useCallback(
    async (publicKeys: string[]) => {
      const currentBlock = await getBlockNumber(config);
      saveKeys(publicKeys, chainId, Number(currentBlock));
    },
    [chainId, config],
  );

  const removeCacheKeys = useCallback(
    async (publicKeys: string[]) => {
      const currentBlock = await getBlockNumber(config);
      removeKeys(publicKeys, chainId, Number(currentBlock));
    },
    [chainId, config],
  );

  return useMemo(
    () => ({
      addCacheKeys,
      removeCacheKeys,
    }),
    [addCacheKeys, removeCacheKeys],
  );
};
