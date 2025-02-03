import { CHAINS } from '@lido-sdk/constants';
import getConfig from 'next/config';
import { useEffect, useMemo, useState } from 'react';

export const useECSanityCheck = () => {
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isSynced, setIsSynced] = useState<boolean>(false);
  const [hasLogs, setHasLogs] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { publicRuntimeConfig } = getConfig();

  const chainId = publicRuntimeConfig.defaultChain;

  const contractTx = useMemo(
    () => ({
      [CHAINS.Mainnet]: `0xf5330dbcf09885ed145c4435e356b5d8a10054751bb8009d3a2605d476ac173f`,
      [CHAINS.Holesky]: `0x1475719ecbb73b28bc531bb54b37695df1bf6b71c6d2bf1d28b4efa404867e26`,
    }),
    [],
  );

  const rpcUrl =
    chainId == 1
      ? publicRuntimeConfig.rpcUrls_1
      : publicRuntimeConfig.rpcUrls_17000;

  useEffect(() => {
    const getSyncStatus = async () => {
      try {
        setIsLoading(true);
        const syncResponse = await fetch(`${rpcUrl}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_syncing',
            params: [],
            id: 0,
          }),
        });
        if (!syncResponse.ok) {
          chainId;
          throw new Error(`HTTP error! Status: ${syncResponse.status}`);
        }

        const syncData = await syncResponse.json();

        setIsInstalled(true);
        setIsSynced(syncData.result ? false : true);
        setIsLoading(false);
      } catch (e) {
        console.error(`Error getting EC data: ${e}`);
        setIsInstalled(false);
        setIsLoading(false);
      }
    };

    void getSyncStatus();
  }, [chainId, rpcUrl]);

  useEffect(() => {
    const getTxStatus = async () => {
      try {
        setIsLoading(true);

        const txResponse = await fetch(`${rpcUrl}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getTransactionReceipt',
            params: [contractTx[chainId as keyof typeof contractTx]],
            id: 0,
          }),
        });

        if (!txResponse.ok) {
          throw new Error(`HTTP error! Status: ${txResponse.status}`);
        }

        const txData = await txResponse.json();

        setHasLogs(txData.result ? true : false);
        setIsLoading(false);
      } catch (e) {
        console.error(`Error getting EC data: ${e}`);
        setIsLoading(false);
      }
    };

    void getTxStatus();
  }, [chainId, contractTx, isSynced, rpcUrl]);

  return { isSynced, isInstalled, hasLogs, isLoading };
};
