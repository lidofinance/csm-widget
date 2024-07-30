import { useSDK } from '@lido-sdk/react';
import { useCallback } from 'react';
import { saveKeys } from 'shared/keys/cachedKeys';
import { DepositData } from 'types';

export const useKeysCache = () => {
  const { chainId, providerRpc } = useSDK(); // FIXME: drop sdk

  return useCallback(
    async (depositData: DepositData[]) => {
      const currentBlock = await providerRpc.getBlockNumber();
      const publicKeys = depositData.map(({ pubkey }) => pubkey);
      saveKeys(publicKeys, chainId, currentBlock);
    },
    [chainId, providerRpc],
  );
};
