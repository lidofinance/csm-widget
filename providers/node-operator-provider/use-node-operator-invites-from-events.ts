import { useLidoSWR } from '@lido-sdk/react';
import { getCSMDeplymentBlockNumber } from 'consts/csm-deployment-block-number';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import {
  NodeOperatorManagerAddressChangeProposedEvent,
  NodeOperatorManagerAddressChangedEvent,
  NodeOperatorRewardAddressChangeProposedEvent,
  NodeOperatorRewardAddressChangedEvent,
} from 'generated/CSModule';
import { useCallback } from 'react';
import { useAccount, useCSModuleRPC } from 'shared/hooks';
import { NodeOperatorId, NodeOperatorInvite } from 'types';
import { addressCompare, getSettledValue } from 'utils';
import { Address } from 'wagmi';

type AddressChangeProposedEvents =
  | NodeOperatorManagerAddressChangeProposedEvent
  | NodeOperatorRewardAddressChangeProposedEvent
  | NodeOperatorManagerAddressChangedEvent
  | NodeOperatorRewardAddressChangedEvent;

// @todo: subscribe to upcoming events
export const useNodeOperatorInvitesFromEvents = (address?: Address) => {
  const contract = useCSModuleRPC();
  const { chainId } = useAccount();

  const restoreEvents = useCallback(
    (events: AddressChangeProposedEvents[]) => {
      type InviteRole = 'r' | 'm';
      type InviteId = `${InviteRole}-${NodeOperatorId}`;
      const invitesMap: Map<InviteId, NodeOperatorInvite> = new Map();

      const updateRoles = (invite: NodeOperatorInvite, add = true) => {
        const id: InviteId = `${invite.manager ? 'r' : 'm'}-${invite.id}`;
        if (add) {
          invitesMap.set(id, invite);
        } else {
          invitesMap.delete(id);
        }
      };

      events.map((e) => {
        const id = e.args.nodeOperatorId.toString() as NodeOperatorId;
        switch (e.event) {
          case 'NodeOperatorManagerAddressChangeProposed':
            return addressCompare(e.args[2], address)
              ? updateRoles({ id, manager: true })
              : updateRoles({ id, manager: true }, false);
          case 'NodeOperatorRewardAddressChangeProposed':
            return addressCompare(e.args[2], address)
              ? updateRoles({ id, rewards: true })
              : updateRoles({ id, rewards: true }, false);
          case 'NodeOperatorManagerAddressChanged':
            return updateRoles({ id, manager: true }, false);
          case 'NodeOperatorRewardAddressChanged':
            return updateRoles({ id, rewards: true }, false);
          default:
            return;
        }
      });

      return Array.from(invitesMap.values());
    },
    [address],
  );

  const fetcher = useCallback(async () => {
    const filters = [
      contract.filters.NodeOperatorManagerAddressChangeProposed(null, address),
      contract.filters.NodeOperatorRewardAddressChangeProposed(null, address),
      contract.filters.NodeOperatorManagerAddressChangeProposed(
        null,
        null,
        address,
      ),
      contract.filters.NodeOperatorRewardAddressChangeProposed(
        null,
        null,
        address,
      ),
      contract.filters.NodeOperatorManagerAddressChanged(null, null, address),
      contract.filters.NodeOperatorRewardAddressChanged(null, null, address),
    ];

    // @todo: use SWR?

    const blockNumber = getCSMDeplymentBlockNumber(chainId);
    const filterResults = await Promise.allSettled(
      filters.map((filter) => contract.queryFilter(filter, blockNumber)),
    );

    const events = filterResults.flatMap(getSettledValue).filter(Boolean);

    return restoreEvents(events as any as AddressChangeProposedEvents[]);
  }, [address, chainId, contract, restoreEvents]);

  return useLidoSWR(['invites', address, chainId], fetcher, STRATEGY_LAZY);
};
