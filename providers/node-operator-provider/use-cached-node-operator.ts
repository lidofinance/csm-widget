import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { useMemo } from 'react';
import { useAddressCompare, useNodeOperatorInfo } from 'shared/hooks';
import { NodeOperatorRoles } from 'types';
import { useCachedId } from './use-cached-id';

export const useCachedNodeOperator = () => {
  const [cachedId, setCachedId] = useCachedId();
  const addressCompare = useAddressCompare();

  const { data } = useNodeOperatorInfo(cachedId, STRATEGY_CONSTANT);

  return useMemo<NodeOperatorRoles | undefined>(() => {
    if (!cachedId || !data) {
      return undefined;
    }

    const rewards = addressCompare(data.rewardAddress);
    const manager = addressCompare(data.managerAddress);

    if (!rewards && !manager) {
      setCachedId(undefined);
      return undefined;
    }

    return {
      id: cachedId,
      rewards,
      manager,
    };
  }, [addressCompare, cachedId, data, setCachedId]);
};
