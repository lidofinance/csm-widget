import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { useMemo } from 'react';
import { useAddressCompare, useNodeOperatorInfo } from 'shared/hooks';
import { NodeOperator } from 'types';
import { useCachedId } from './use-cached-id';
import { packRoles } from 'utils';

export const useCachedNodeOperator = () => {
  const [cachedId, setCachedId] = useCachedId();
  const isUserAddress = useAddressCompare();

  const { data } = useNodeOperatorInfo(cachedId, STRATEGY_CONSTANT);

  return useMemo<NodeOperator | undefined>(() => {
    if (!cachedId || !data) {
      return undefined;
    }

    const rewards = isUserAddress(data.rewardAddress);
    const manager = isUserAddress(data.managerAddress);

    // TODO: fix for spectacular
    if (!rewards && !manager) {
      setCachedId(undefined);
      return undefined;
    }

    return {
      id: cachedId,
      roles: packRoles({ rewards, manager }),
    };
  }, [isUserAddress, cachedId, data, setCachedId]);
};
