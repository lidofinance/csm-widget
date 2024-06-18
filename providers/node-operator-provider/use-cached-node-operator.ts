import { useLocalStorage } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useCallback, useMemo } from 'react';
import { useAccount, useNodeOperatorInfo } from 'shared/hooks';
import { NodeOperatorId, NodeOperatorRoles } from 'types';
import { addressCompare } from 'utils';
import { Address } from 'wagmi';

export const useCachedNodeOperator = (address?: Address) => {
  const { chainId } = useAccount();

  const [cachedId, setCachedId] = useLocalStorage<NodeOperatorId | undefined>(
    `CSM-NO-${chainId}-${address}`,
    undefined,
  );

  const { data } = useNodeOperatorInfo(cachedId, STRATEGY_LAZY);

  const cached = useMemo<NodeOperatorRoles | undefined>(() => {
    if (!cachedId || !data || !address) {
      return undefined;
    }

    const rewards = addressCompare(address, data.rewardAddress);
    const manager = addressCompare(address, data.managerAddress);

    if (!rewards && !manager) {
      setCachedId(undefined);
      return undefined;
    }

    return {
      id: cachedId,
      rewards,
      manager,
    };
  }, [address, cachedId, data, setCachedId]);

  const setCached = useCallback(
    (value?: NodeOperatorRoles) => {
      if (value) {
        setCachedId(value?.id);
      }
    },
    [setCachedId],
  );

  return useMemo(() => [cached, setCached] as const, [cached, setCached]);
};
