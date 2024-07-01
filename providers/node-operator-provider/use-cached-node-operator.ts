import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { useMemo } from 'react';
import { useAddressCompare, useNodeOperatorInfo } from 'shared/hooks';
import { NodeOperatorRoles } from 'types';
import { useCachedId } from './use-cached-id';

export const useCachedNodeOperator = () => {
  const [cachedId, setCachedId] = useCachedId();
  const isUserAddress = useAddressCompare();

  const { data } = useNodeOperatorInfo(cachedId, STRATEGY_CONSTANT);

  return useMemo<NodeOperatorRoles | undefined>(() => {
    if (!cachedId || !data) {
      return undefined;
    }

    const rewards = isUserAddress(data.rewardAddress);
    const manager = isUserAddress(data.managerAddress);

    if (!rewards && !manager) {
      setCachedId(undefined);
      return undefined;
    }

    return {
      id: cachedId,
      rewards,
      manager,
    };
  }, [isUserAddress, cachedId, data, setCachedId]);
};
