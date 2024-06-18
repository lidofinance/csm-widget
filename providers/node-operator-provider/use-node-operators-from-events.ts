import { useLidoSWR } from '@lido-sdk/react';
import { getCSMDeplymentBlockNumber } from 'consts/csm-deployment-block-number';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import {
  NodeOperatorAddedEvent,
  NodeOperatorManagerAddressChangedEvent,
  NodeOperatorRewardAddressChangedEvent,
} from 'generated/CSModule';
import { useCallback } from 'react';
import { useAccount, useCSModuleRPC } from 'shared/hooks';
import { NodeOperatorId, NodeOperatorRoles } from 'types';
import { addressCompare, getSettledValue } from 'utils';
import { Address } from 'wagmi';

type NodeOperatorRoleEvent =
  | NodeOperatorAddedEvent
  | NodeOperatorRewardAddressChangedEvent
  | NodeOperatorManagerAddressChangedEvent;

// @todo: subscribe to upcoming events
export const useNodeOperatorsFromEvents = (address?: Address) => {
  const contract = useCSModuleRPC();
  const { chainId } = useAccount();

  const restoreEvents = useCallback(
    (events: NodeOperatorRoleEvent[]) => {
      const rolesMap: Map<NodeOperatorId, NodeOperatorRoles> = new Map();

      const updateRoles = (patch: NodeOperatorRoles) => {
        const oldRoles = rolesMap.get(patch.id);
        const roles = { ...oldRoles, ...patch };
        if (roles.manager || roles.rewards) {
          rolesMap.set(roles.id, roles);
        } else {
          rolesMap.delete(roles.id);
        }
      };

      events
        .sort((a, b) => a.blockNumber - b.blockNumber)
        .forEach((e) => {
          const id = e.args.nodeOperatorId.toString() as NodeOperatorId;
          switch (e.event) {
            case 'NodeOperatorAdded':
              return updateRoles({
                id,
                manager: addressCompare(e.args[1], address),
                rewards: addressCompare(e.args[2], address),
              });
            case 'NodeOperatorManagerAddressChanged':
              return updateRoles({
                id,
                manager: addressCompare(e.args[2], address),
              });
            case 'NodeOperatorRewardAddressChanged':
              return updateRoles({
                id,
                rewards: addressCompare(e.args[2], address),
              });
            default:
              return;
          }
        });

      return Array.from(rolesMap.values());
    },
    [address],
  );

  const fetcher = useCallback(async () => {
    const filters = [
      contract.filters.NodeOperatorAdded(null, address),
      contract.filters.NodeOperatorAdded(null, null, address),
      contract.filters.NodeOperatorManagerAddressChanged(null, address),
      contract.filters.NodeOperatorManagerAddressChanged(null, null, address),
      contract.filters.NodeOperatorRewardAddressChanged(null, address),
      contract.filters.NodeOperatorRewardAddressChanged(null, null, address),
    ];

    // @todo: use SWR?
    const blockNumber = getCSMDeplymentBlockNumber(chainId);
    const filterResults = await Promise.allSettled(
      filters.map((filter) => contract.queryFilter(filter, blockNumber)),
    );

    const events = filterResults.flatMap(getSettledValue).filter(Boolean);

    return restoreEvents(events as any as NodeOperatorRoleEvent[]);
  }, [address, chainId, contract, restoreEvents]);

  return useLidoSWR(['no-list', address, chainId], fetcher, STRATEGY_LAZY);
};
