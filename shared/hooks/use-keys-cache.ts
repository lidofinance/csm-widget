import { useDappStatus } from 'modules/web3';
import { useCallback, useMemo } from 'react';
import { removeKeys, saveKeys } from 'shared/keys/cachedKeys';
import { usePublicClient } from 'wagmi';

// FIXME: refactor
export const useKeysCache = () => {
  const { chainId } = useDappStatus();
  const client = usePublicClient();

  const addCacheKeys = useCallback(
    async (publicKeys: string[]) => {
      const currentBlock = await client?.getBlockNumber();
      saveKeys(publicKeys, chainId, Number(currentBlock));
    },
    [chainId, client],
  );

  const removeCacheKeys = useCallback(
    async (publicKeys: string[]) => {
      const currentBlock = await client?.getBlockNumber();
      removeKeys(publicKeys, chainId, Number(currentBlock));
    },
    [chainId, client],
  );

  return useMemo(
    () => ({
      addCacheKeys,
      removeCacheKeys,
    }),
    [addCacheKeys, removeCacheKeys],
  );
};
