import { useLidoSWR } from '@lido-sdk/react';
import { getCSMDeplymentBlockNumber } from 'consts/csm-deployment-block-number';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import {
  NodeOperatorAddedEvent,
  NodeOperatorManagerAddressChangedEvent,
  NodeOperatorRewardAddressChangedEvent,
} from 'generated/CSModule';
import { useCallback } from 'react';
import { useAccount, useAddressCompare, useCSModuleRPC } from 'shared/hooks';
import { NodeOperatorId, NodeOperatorRoles } from 'types';
import { getSettledValue } from 'utils';
import { mergeRoles } from './mergeRoles';

type NodeOperatorRoleEvent =
  | NodeOperatorAddedEvent
  | NodeOperatorRewardAddressChangedEvent
  | NodeOperatorManagerAddressChangedEvent;

export const useNodeOperatorsFromEvents = () => {
  const contract = useCSModuleRPC();
  const isUserAddress = useAddressCompare();
  const { chainId, address } = useAccount();

  const restoreEvents = useCallback(
    (events: NodeOperatorRoleEvent[]) =>
      events
        .sort((a, b) => a.blockNumber - b.blockNumber)
        .reduce((prev, e) => {
          const id = e.args.nodeOperatorId.toString() as NodeOperatorId;
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
              });
            case 'NodeOperatorRewardAddressChanged':
              return mergeRoles(prev, {
                id,
                rewards: isUserAddress(e.args[2]),
              });
            default:
          }
          return prev;
        }, [] as NodeOperatorRoles[]),
    [isUserAddress],
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

    const blockNumber = getCSMDeplymentBlockNumber(chainId);
    const filterResults = await Promise.allSettled(
      filters.map((filter) => contract.queryFilter(filter, blockNumber)),
    );

    const events = filterResults.flatMap(getSettledValue).filter(Boolean);

    return restoreEvents(events as any as NodeOperatorRoleEvent[]);
  }, [address, chainId, contract, restoreEvents]);

  return useLidoSWR(['no-list', address, chainId], fetcher, STRATEGY_LAZY);
};
