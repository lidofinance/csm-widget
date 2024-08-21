import { getCsmConstants } from 'consts/csm-constants';
import {
  NodeOperatorManagerAddressChangeProposedEvent,
  NodeOperatorManagerAddressChangedEvent,
  NodeOperatorRewardAddressChangeProposedEvent,
  NodeOperatorRewardAddressChangedEvent,
} from 'generated/CSModule';
import { useCallback } from 'react';
import { useAccount, useAddressCompare, useCSModuleRPC } from 'shared/hooks';
import { NodeOperatorId, NodeOperatorInvite } from 'types';
import { getSettledValue } from 'utils';

type AddressChangeProposedEvents =
  | NodeOperatorManagerAddressChangeProposedEvent
  | NodeOperatorRewardAddressChangeProposedEvent
  | NodeOperatorManagerAddressChangedEvent
  | NodeOperatorRewardAddressChangedEvent;

export const useInvitesEventsFetcher = () => {
  const { address, chainId } = useAccount();
  const contract = useCSModuleRPC();
  const isUserAddress = useAddressCompare();

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

      events
        .sort((a, b) => a.blockNumber - b.blockNumber)
        .map((e) => {
          const id = e.args.nodeOperatorId.toString() as NodeOperatorId;
          switch (e.event) {
            case 'NodeOperatorManagerAddressChangeProposed':
              return isUserAddress(e.args[2])
                ? updateRoles({ id, manager: true })
                : updateRoles({ id, manager: true }, false);
            case 'NodeOperatorRewardAddressChangeProposed':
              return isUserAddress(e.args[2])
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

      return Array.from(invitesMap.values()).sort(
        (a, b) =>
          parseInt(a.id, 10) - parseInt(b.id, 10) ||
          -Number(b.rewards ?? false) - Number(a.rewards ?? false),
      );
    },
    [isUserAddress],
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

    // TODO: errors handler
    const blockNumber = getCsmConstants(chainId).deploymentBlockNumber;
    const filterResults = await Promise.allSettled(
      filters.map((filter) => contract.queryFilter(filter, blockNumber)),
    );

    const events = filterResults.flatMap(getSettledValue).filter(Boolean);

    return restoreEvents(events as any as AddressChangeProposedEvents[]);
  }, [address, chainId, contract, restoreEvents]);

  return fetcher;
};
