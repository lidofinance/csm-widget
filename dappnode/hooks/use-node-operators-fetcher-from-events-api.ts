import { useCallback } from 'react';
import useDappnodeUrls from './use-dappnode-urls';
import { NodeOperator } from 'types';
import { compareLowercase, mergeRoles } from 'utils';

/**
 * This hook acts as an alternative to the hook `useNodeOperatorsFetcherFromEvents`.
 * Fetching the events "NodeOperatorAdded", "NodeOperatorManagerAddressChanged" and "NodeOperatorRewardAddressChanged"
 * directly to an RPC endpoint can take several minutes specially in ethereum mainnet.
 *
 * This hook fetches the events from an API endpoint of the lido-events backend that fetches the events and indexes them for
 * faster retrieval.
 *
 * In the first login of the user this fetch can take several minutes, but in the next logins the events are fetched from the cache til the latest block.
 *
 * The lido-events backend will return http code 202 if the address is still being processed, in that case the hook will retry the fetch every 5 seconds and must never
 * resolve the promise to keep the isListLoading being true.
 *
 * stats:
 * - Geth: around 1.5 minutes
 * - Besu: around 7 minutes
 */

type NodeOperatorRoleEvent =
  | {
      event: 'NodeOperatorAdded';
      nodeOperatorId: string;
      managerAddress: string;
      rewardAddress: string;
      blockNumber: number;
    }
  | {
      event: 'NodeOperatorManagerAddressChanged';
      nodeOperatorId: string;
      oldAddress: string;
      newAddress: string;
      blockNumber: number;
    }
  | {
      event: 'NodeOperatorRewardAddressChanged';
      nodeOperatorId: string;
      oldAddress: string;
      newAddress: string;
      blockNumber: number;
    };

const restoreEvents = (
  events: NodeOperatorRoleEvent[],
  address?: string,
): NodeOperator[] => {
  const isUserAddress = (value: string) => compareLowercase(address, value);

  return events
    .sort((a, b) => a.blockNumber - b.blockNumber)
    .reduce((prev, e) => {
      const id: `${number}` = `${parseInt(e.nodeOperatorId)}`;
      switch (e.event) {
        case 'NodeOperatorAdded':
          return mergeRoles(prev, {
            id,
            manager: isUserAddress(e.managerAddress),
            rewards: isUserAddress(e.rewardAddress),
          });
        case 'NodeOperatorManagerAddressChanged':
          return mergeRoles(prev, {
            id,
            manager: isUserAddress(e.newAddress),
          });
        case 'NodeOperatorRewardAddressChanged':
          return mergeRoles(prev, {
            id,
            rewards: isUserAddress(e.newAddress),
          });
        default:
          return prev;
      }
    }, [] as NodeOperator[]);
};

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
const parseEvents = (data: any): NodeOperatorRoleEvent[] => {
  const {
    nodeOperatorAdded = [],
    nodeOperatorManagerAddressChanged = [],
    nodeOperatorRewardAddressChanged = [],
  } = data;

  const parsedAddedEvents = nodeOperatorAdded.map((event: any) => ({
    event: 'NodeOperatorAdded',
    nodeOperatorId: `${parseInt(event.NodeOperatorId)}`,
    managerAddress: event.ManagerAddress,
    rewardAddress: event.RewardAddress,
    blockNumber: parseInt(event.Raw.blockNumber, 16),
  }));

  const parsedManagerChangedEvents = nodeOperatorManagerAddressChanged.map(
    (event: any) => ({
      event: 'NodeOperatorManagerAddressChanged',
      nodeOperatorId: `${parseInt(event.NodeOperatorId)}`,
      oldAddress: event.OldAddress,
      newAddress: event.NewAddress,
      blockNumber: parseInt(event.Raw.blockNumber, 16),
    }),
  );

  const parsedRewardChangedEvents = nodeOperatorRewardAddressChanged.map(
    (event: any) => ({
      event: 'NodeOperatorRewardAddressChanged',
      nodeOperatorId: `${parseInt(event.NodeOperatorId)}`,
      oldAddress: event.OldAddress,
      newAddress: event.NewAddress,
      blockNumber: parseInt(event.Raw.blockNumber, 16),
    }),
  );

  return [
    ...parsedAddedEvents,
    ...parsedManagerChangedEvents,
    ...parsedRewardChangedEvents,
  ];
};

export const useNodeOperatorsFetcherFromAPI = (address?: string) => {
  const { backendUrl } = useDappnodeUrls();

  return useCallback(async () => {
    if (!address) {
      console.error('Address is required to fetch Node Operator events');
      return [];
    }

    try {
      console.debug(
        `Fetching events associated with Node Operator address: ${address}`,
      );

      const url = `${backendUrl}/api/v0/events_indexer/address_events?address=${address}`;
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Retry logic for 202 status
      const response = await fetchWithRetry(url, options, 5000);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const events = parseEvents(data);

      console.debug('Parsed events:', events);

      return restoreEvents(events, address);
    } catch (e) {
      console.error(`Error fetching Node Operator events from API: ${e}`);
      return [];
    }
  }, [backendUrl, address]);
};
