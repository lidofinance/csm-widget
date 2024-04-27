import { useLidoSWR } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import {
  NodeOperatorManagerAddressChangeProposedEvent,
  NodeOperatorRewardAddressChangeProposedEvent,
} from 'generated/CSModule';
import { useCallback, useMemo } from 'react';
import { NodeOperatorInvite } from 'types';
import { Address } from 'wagmi';
import { useCSModuleRPC } from './useCsmContracts';

type AddressChangeProposedEvents =
  | NodeOperatorManagerAddressChangeProposedEvent
  | NodeOperatorRewardAddressChangeProposedEvent;

// @todo: invalidate applied invites & double-invites
export const useNodeOperatorInvitesFromEvents = (address?: Address) => {
  const contract = useCSModuleRPC();

  const fetcher = useCallback(
    async (address: Address) => {
      const filters = [
        contract.filters.NodeOperatorManagerAddressChangeProposed(
          null,
          address,
        ),
        contract.filters.NodeOperatorRewardAddressChangeProposed(null, address),
      ];

      // @todo: use SWR?
      const filterResults = await Promise.allSettled(
        filters.map((filter) => contract.queryFilter(filter)),
      );

      return filterResults
        .flatMap(
          (result) =>
            (
              result as any as PromiseFulfilledResult<AddressChangeProposedEvents>
            ).value,
        )
        .filter(Boolean);
    },
    [contract],
  );

  const { data: events, initialLoading } = useLidoSWR(
    address,
    fetcher,
    STRATEGY_LAZY,
  );

  const invites = useMemo(() => {
    if (!events) return [];

    return events
      .map((e) => {
        const id = e.args.nodeOperatorId.toString();
        switch (e.event) {
          case 'NodeOperatorManagerAddressChangeProposed':
            return { id, manager: true };
          case 'NodeOperatorRewardAddressChangePurposed':
            return { id, rewards: true };
          default:
            return;
        }
      })
      .filter(Boolean) as NodeOperatorInvite[];
  }, [events]);

  return { data: invites, initialLoading };
};
