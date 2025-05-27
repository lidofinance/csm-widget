import {
  getNodeOperatorRoles,
  NodeOperatorInfo,
} from '@lidofinance/lido-csm-sdk';
import { NodeOperator } from '@lidofinance/lido-csm-sdk/common';
import { useCallback } from 'react';
import { useDappStatus, useOperatorInfo } from '../hooks';
import { useCachedId } from './use-cached-id';

export const useCachedNodeOperator = () => {
  const { address } = useDappStatus();
  const [cachedId, setCachedId] = useCachedId();

  const select = useCallback(
    (data: NodeOperatorInfo) => {
      if (!cachedId || !address) return undefined;
      const roles = getNodeOperatorRoles(data, address);

      if (roles.length === 0) {
        setCachedId(undefined);
        return undefined;
      }

      return { id: cachedId, roles } as NodeOperator;
    },
    [address, cachedId, setCachedId],
  );

  return useOperatorInfo(cachedId, select);
};
