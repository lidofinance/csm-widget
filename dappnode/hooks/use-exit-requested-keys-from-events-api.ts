import { useLidoSWR } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback } from 'react';
import { useAccount } from 'shared/hooks';
import useDappnodeUrls from './use-dappnode-urls';

interface ExitRequest {
  event: {
    [key: string]: any;
  };
  [key: string]: any;
  validator_pubkey_hex: string;
}
type ExitRequests = Record<string, ExitRequest>;

const parseEvents = (data: ExitRequests) => {
  return Object.values(data).map((event: ExitRequest) => ({
    validatorPubkey: event.validator_pubkey_hex.toLowerCase(),
    blockNumber: parseInt(event.event.Raw.blockNumber, 16),
  }));
};

const restoreEvents = (
  events: { validatorPubkey: string; blockNumber: number }[],
) =>
  events
    .sort((a, b) => a.blockNumber - b.blockNumber)
    .map((e) => e.validatorPubkey);

export const useExitRequestedKeysFromEvents = () => {
  const { backendUrl } = useDappnodeUrls();
  const { chainId } = useAccount();
  const nodeOperatorId = useNodeOperatorId();

  const fetcher = useCallback(async () => {
    if (!nodeOperatorId) {
      console.error('Node Operator ID is required to fetch exit requests');
      return [];
    }

    try {
      console.debug(
        `Fetching exit requests for Node Operator ID: ${nodeOperatorId}`,
      );
      const url = `${backendUrl}/api/v0/events_indexer/exit_requests?operatorId=${nodeOperatorId}`;
      const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: ExitRequests = await response.json();
      const events = parseEvents(data);

      return restoreEvents(events);
    } catch (e) {
      console.error(`Error fetching exit request events: ${e}`);
      return [];
    }
  }, [backendUrl, nodeOperatorId]);

  return useLidoSWR(
    ['exit-requested-keys', nodeOperatorId, chainId],
    nodeOperatorId ? fetcher : null,
    STRATEGY_LAZY,
  );
};
