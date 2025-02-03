import { useLidoSWR } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback } from 'react';
import { useAccount } from 'shared/hooks';
import useDappnodeUrls from './use-dappnode-urls';

const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  timeout: number,
): Promise<Response> => {
  const shouldRetry = true;
  while (shouldRetry) {
    const response = await fetch(url, options);
    if (response.status === 202) {
      console.debug(
        `Received status 202. Retrying in ${timeout / 1000} seconds...`,
      );
      await new Promise((resolve) => setTimeout(resolve, timeout));
    } else {
      return response;
    }
  }

  return new Response();
};

const parseEvents = (data: any) => {
  return (data?.withdrawals || []).map((event: any) => ({
    keyIndex: parseInt(event.KeyIndex, 10),
    blockNumber: parseInt(event.Raw.blockNumber, 16),
  }));
};

const restoreEvents = (events: { keyIndex: number; blockNumber: number }[]) =>
  events.sort((a, b) => a.blockNumber - b.blockNumber).map((e) => e.keyIndex);

export const useWithdrawnKeyIndexesFromEvents = () => {
  const { backendUrl } = useDappnodeUrls();
  const { chainId } = useAccount();
  const nodeOperatorId = useNodeOperatorId();

  const fetcher = useCallback(async () => {
    if (!nodeOperatorId) {
      console.error('Node Operator ID is required to fetch withdrawals');
      return [];
    }

    try {
      console.debug(
        `Fetching withdrawals for Node Operator ID: ${nodeOperatorId}`,
      );
      const url = `${backendUrl}/api/v0/events_indexer/withdrawals_submitted?operatorId=${nodeOperatorId}`;
      const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      };

      // Retry logic for 202 status
      const response = await fetchWithRetry(url, options, 5000);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const events = parseEvents(data);

      console.debug('Parsed withdrawal events:', events);

      return restoreEvents(events);
    } catch (e) {
      console.error(`Error fetching withdrawal events: ${e}`);
      return [];
    }
  }, [backendUrl, nodeOperatorId]);

  return useLidoSWR(
    ['withdrawn-keys', nodeOperatorId, chainId],
    nodeOperatorId ? fetcher : null,
    STRATEGY_LAZY,
  );
};
