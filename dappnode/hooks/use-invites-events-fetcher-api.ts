import { ROLES } from 'consts/roles';
import { useCallback } from 'react';
import { useAccount, useAddressCompare } from 'shared/hooks';
import { getInviteId } from 'shared/node-operator';
import { NodeOperatorInvite } from 'types';
import { getNodeOperatorIdFromEvent } from 'utils';
import useDappnodeUrls from './use-dappnode-urls';
import {
  NodeOperatorManagerAddressChangeProposedEvent,
  NodeOperatorRewardAddressChangeProposedEvent,
  NodeOperatorManagerAddressChangedEvent,
  NodeOperatorRewardAddressChangedEvent,
} from 'generated/CSModule';
import { fetchWithRetry } from 'dappnode/utils/fetchWithRetry';

type AddressChangeProposedEvents =
  | NodeOperatorManagerAddressChangeProposedEvent
  | NodeOperatorRewardAddressChangeProposedEvent
  | NodeOperatorManagerAddressChangedEvent
  | NodeOperatorRewardAddressChangedEvent;

const parseEvents = (data: any) => {
  return [
    ...(data.nodeOperatorManagerAddressChangeProposed || []).map(
      (event: any) => ({
        event: 'NodeOperatorManagerAddressChangeProposed',
        nodeOperatorId: `${parseInt(event.NodeOperatorId)}`,
        newAddress: event.NewAddress,
        blockNumber: parseInt(event.Raw.blockNumber, 16),
      }),
    ),
    ...(data.nodeOperatorRewardAddressChangeProposed || []).map(
      (event: any) => ({
        event: 'NodeOperatorRewardAddressChangeProposed',
        nodeOperatorId: `${parseInt(event.NodeOperatorId)}`,
        newAddress: event.NewAddress,
        blockNumber: parseInt(event.Raw.blockNumber, 16),
      }),
    ),
    ...(data.nodeOperatorManagerAddressChanged || []).map((event: any) => ({
      event: 'NodeOperatorManagerAddressChanged',
      nodeOperatorId: `${parseInt(event.NodeOperatorId)}`,
      oldAddress: event.OldAddress,
      newAddress: event.NewAddress,
      blockNumber: parseInt(event.Raw.blockNumber, 16),
    })),
    ...(data.nodeOperatorRewardAddressChanged || []).map((event: any) => ({
      event: 'NodeOperatorRewardAddressChanged',
      nodeOperatorId: `${parseInt(event.NodeOperatorId)}`,
      oldAddress: event.OldAddress,
      newAddress: event.NewAddress,
      blockNumber: parseInt(event.Raw.blockNumber, 16),
    })),
  ];
};

export const useInvitesEventsFetcher = () => {
  const { address } = useAccount();
  const { backendUrl } = useDappnodeUrls();
  const isUserAddress = useAddressCompare();

  const restoreEvents = useCallback(
    (events: AddressChangeProposedEvents[]) => {
      const invitesMap: Map<string, NodeOperatorInvite> = new Map();

      const updateRoles = (invite: NodeOperatorInvite, add = true) => {
        const id = getInviteId(invite);
        if (add) {
          invitesMap.set(id, invite);
        } else {
          invitesMap.delete(id);
        }
      };

      events
        .sort((a, b) => a.blockNumber - b.blockNumber)
        .forEach((e) => {
          const id = getNodeOperatorIdFromEvent(e);
          switch (e.event) {
            case 'NodeOperatorManagerAddressChangeProposed':
              return isUserAddress(e.args[2])
                ? updateRoles({ id, role: ROLES.MANAGER })
                : updateRoles({ id, role: ROLES.MANAGER }, false);
            case 'NodeOperatorRewardAddressChangeProposed':
              return isUserAddress(e.args[2])
                ? updateRoles({ id, role: ROLES.REWARDS })
                : updateRoles({ id, role: ROLES.REWARDS }, false);
            case 'NodeOperatorManagerAddressChanged':
              return updateRoles({ id, role: ROLES.MANAGER }, false);
            case 'NodeOperatorRewardAddressChanged':
              return updateRoles({ id, role: ROLES.REWARDS }, false);
            default:
              return;
          }
        });

      return Array.from(invitesMap.values()).sort(
        (a, b) =>
          parseInt(a.id, 10) - parseInt(b.id, 10) ||
          -Number(b.role === ROLES.REWARDS) - Number(a.role === ROLES.REWARDS),
      );
    },
    [isUserAddress],
  );

  const fetcher = useCallback(async () => {
    try {
      console.debug(`Fetching invite events for address: ${address}`);
      const url = `${backendUrl}/api/v0/events_indexer/address_events?address=${address}`;
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

      console.debug('Parsed invite events:', events);

      return restoreEvents(events);
    } catch (e) {
      console.error(`Error fetching invite events: ${e}`);
      return [];
    }
  }, [backendUrl, address, restoreEvents]);

  return fetcher;
};
