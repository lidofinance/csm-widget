import {
  getNodeOperatorRoles,
  NodeOperatorShortInfo,
} from '@lidofinance/lido-csm-sdk';
import { useCallback } from 'react';
import { useDappStatus, useOperatorShortInfo } from '../hooks';
import { useCachedId } from './use-cached-id';
import { ModuleNodeOperator } from './types';

export const useCachedNodeOperator = () => {
  const { address } = useDappStatus();
  const [cachedRef, setCachedRef] = useCachedId();

  const select = useCallback(
    (data: NodeOperatorShortInfo): ModuleNodeOperator | undefined => {
      if (!cachedRef || !address) return undefined;
      const roles = getNodeOperatorRoles(data, address);
      if (roles.length === 0) {
        setCachedRef(undefined);
        return undefined;
      }
      return { ...data, module: cachedRef.module };
    },
    [address, cachedRef, setCachedRef],
  );

  return useOperatorShortInfo<ModuleNodeOperator | undefined>(
    cachedRef?.id,
    select,
    cachedRef?.module,
  );
};
