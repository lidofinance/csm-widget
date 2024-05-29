import { useLidoSWR } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import {
  NodeOperatorAddedEvent,
  NodeOperatorManagerAddressChangedEvent,
  NodeOperatorRewardAddressChangedEvent,
} from 'generated/CSModule';
import { useCallback, useEffect, useState } from 'react';
import { useAccount, useCSModuleRPC } from 'shared/hooks';
import { NodeOperatorId, NodeOperatorRoles } from 'types';
import { Address } from 'wagmi';

type NodeOperatorRoleEvent =
  | NodeOperatorAddedEvent
  | NodeOperatorRewardAddressChangedEvent
  | NodeOperatorManagerAddressChangedEvent;

export const useNodeOperatorsFromEvents = (address?: Address) => {
  const contract = useCSModuleRPC();
  const { chainId } = useAccount();
  const [roles, setRoles] = useState<NodeOperatorRoles[]>([]);

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
    const filterResults = await Promise.allSettled(
      filters.map((filter) => contract.queryFilter(filter)),
    );

    return filterResults
      .flatMap(
        (result) =>
          (result as any as PromiseFulfilledResult<NodeOperatorRoleEvent>)
            .value,
      )
      .filter(Boolean);
  }, [address, contract]);

  const { data: events, initialLoading } = useLidoSWR(
    ['ids', address, chainId],
    fetcher,
    STRATEGY_LAZY,
  );

  useEffect(() => {
    if (!address || !events) {
      setRoles([]);
      return;
    }

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
        const id = e.args.nodeOperatorId.toString();
        switch (e.event) {
          case 'NodeOperatorAdded':
            return updateRoles({
              id,
              manager: e.args[1] === address,
              rewards: e.args[2] === address,
            });
          case 'NodeOperatorManagerAddressChanged':
            return updateRoles({ id, manager: e.args[2] === address });
          case 'NodeOperatorRewardAddressChanged':
            return updateRoles({ id, rewards: e.args[2] === address });
          default:
            return;
        }
      });

    setRoles(Array.from(rolesMap.values()));
  }, [address, events]);

  const append = useCallback((no: NodeOperatorRoles) => {
    setRoles((prev) => [...prev, no]);
  }, []);

  return { data: roles, initialLoading, append };
};
