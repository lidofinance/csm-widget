import {
  getNodeOperatorRoles,
  NodeOperatorShortInfo,
} from '@lidofinance/lido-csm-sdk';
import { useCallback } from 'react';
import { useDappStatus, useOperatorShortInfo } from '../hooks';
import { useCachedId } from './use-cached-id';

export const useCachedNodeOperator = () => {
  const { address } = useDappStatus();
  const [cachedId, setCachedId] = useCachedId();

  const select = useCallback(
    (data: NodeOperatorShortInfo) => {
      if (!cachedId || !address) return undefined;
      const roles = getNodeOperatorRoles(data, address);

      if (roles.length === 0) {
        setCachedId(undefined);
        return undefined;
      }

      return data;
    },
    [address, cachedId, setCachedId],
  );

  return useOperatorShortInfo(cachedId, select);
};
