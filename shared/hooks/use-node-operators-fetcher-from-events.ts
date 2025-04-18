import { getCsmConstants } from 'consts/csm-constants';
import {
  NodeOperatorAddedEvent,
  NodeOperatorManagerAddressChangedEvent,
  NodeOperatorRewardAddressChangedEvent,
} from 'generated/CSModule';
import { useCallback } from 'react';
import { useCSModuleRPC } from 'shared/hooks';
import { NodeOperator } from 'types';
import {
  compareLowercase,
  getNodeOperatorIdFromEvent,
  getSettledValue,
  mergeRoles,
} from 'utils';
import { Address } from 'wagmi';

type NodeOperatorRoleEvent =
  | NodeOperatorAddedEvent
  | NodeOperatorRewardAddressChangedEvent
  | NodeOperatorManagerAddressChangedEvent;

const restoreEvents = (events: NodeOperatorRoleEvent[], address?: Address) => {
  const isUserAddress = (value: string) =>
    compareLowercase(address, value) || null;

  return events
    .sort((a, b) => a.blockNumber - b.blockNumber)
    .reduce((prev, e) => {
      const id = getNodeOperatorIdFromEvent(e);
      switch (e.event) {
        case 'NodeOperatorAdded':
          return mergeRoles(prev, {
            id,
            manager: isUserAddress(e.args[1]),
            rewards: isUserAddress(e.args[2]),
          });
        case 'NodeOperatorManagerAddressChanged':
          return mergeRoles(prev, {
            id,
            manager: isUserAddress(e.args[2]),
            rewards: false,
          });
        case 'NodeOperatorRewardAddressChanged':
          return mergeRoles(prev, {
            id,
            manager: false,
            rewards: isUserAddress(e.args[2]),
          });
        default:
      }
      return prev;
    }, [] as NodeOperator[]);
};

export const useNodeOperatorsFetcherFromEvents = (
  address?: Address,
  chainId?: number,
) => {
  const contract = useCSModuleRPC();

  return useCallback(async () => {
    const filters = [
      contract.filters.NodeOperatorAdded(null, address),
      contract.filters.NodeOperatorAdded(null, null, address),
      contract.filters.NodeOperatorManagerAddressChanged(null, address),
      contract.filters.NodeOperatorManagerAddressChanged(null, null, address),
      contract.filters.NodeOperatorRewardAddressChanged(null, address),
      contract.filters.NodeOperatorRewardAddressChanged(null, null, address),
    ];

    const blockNumber = getCsmConstants(chainId).deploymentBlockNumber;
    const filterResults = await Promise.allSettled(
      filters.map((filter) => contract.queryFilter(filter, blockNumber)),
    );

    const events = filterResults.flatMap(getSettledValue).filter(Boolean);

    return restoreEvents(events as any as NodeOperatorRoleEvent[], address);
  }, [address, chainId, contract]);
};
