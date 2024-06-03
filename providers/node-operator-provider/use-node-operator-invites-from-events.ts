import { useLidoSWR } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import {
  NodeOperatorManagerAddressChangeProposedEvent,
  NodeOperatorManagerAddressChangedEvent,
  NodeOperatorRewardAddressChangeProposedEvent,
  NodeOperatorRewardAddressChangedEvent,
} from 'generated/CSModule';
import { useCallback, useMemo } from 'react';
import { useAccount, useCSModuleRPC } from 'shared/hooks';
import { NodeOperatorId, NodeOperatorInvite } from 'types';
import { Address } from 'wagmi';

type AddressChangeProposedEvents =
  | NodeOperatorManagerAddressChangeProposedEvent
  | NodeOperatorRewardAddressChangeProposedEvent
  | NodeOperatorManagerAddressChangedEvent
  | NodeOperatorRewardAddressChangedEvent;

// @todo: invalidate aplied invites & double-invites
export const useNodeOperatorInvitesFromEvents = (address?: Address) => {
  const contract = useCSModuleRPC();
  const { chainId } = useAccount();

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
    const filterResults = await Promise.allSettled(
      filters.map((filter) => contract.queryFilter(filter)),
    );

    return filterResults
      .flatMap(
        (result) =>
          (result as any as PromiseFulfilledResult<AddressChangeProposedEvents>)
            .value,
      )
      .filter(Boolean);
  }, [address, contract]);

  const { data: events, initialLoading } = useLidoSWR(
    ['invites', address, chainId],
    fetcher,
    STRATEGY_LAZY,
  );

  const invites = useMemo(() => {
    if (!address || !events) {
      return [];
    }

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
      const id = e.args.nodeOperatorId.toString();
      switch (e.event) {
        case 'NodeOperatorManagerAddressChangeProposed':
          return e.args[2] === address
            ? updateRoles({ id, manager: true })
            : updateRoles({ id, manager: true }, false);
        case 'NodeOperatorRewardAddressChangeProposed':
          return e.args[2] === address
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
  }, [address, events]);

  return { data: invites, initialLoading };
};
