import { getCsmConstants } from 'consts/csm-constants';
import { ROLES } from 'consts/roles';
import {
  NodeOperatorManagerAddressChangeProposedEvent,
  NodeOperatorManagerAddressChangedEvent,
  NodeOperatorRewardAddressChangeProposedEvent,
  NodeOperatorRewardAddressChangedEvent,
} from 'generated/CSModule';
import { useCallback } from 'react';
import { useAccount, useAddressCompare, useCSModuleRPC } from 'shared/hooks';
import { getInviteId } from 'shared/node-operator';
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
      const invitesMap: Map<
        ReturnType<typeof getInviteId>,
        NodeOperatorInvite
      > = new Map();

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
        .map((e) => {
          const id = e.args.nodeOperatorId.toString() as NodeOperatorId;
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
