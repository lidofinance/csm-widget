import {
  getNodeOperatorRoles,
  NodeOperatorShortInfo,
} from '@lidofinance/lido-csm-sdk';
import { useCallback, useEffect } from 'react';
import { useDappStatus, useOperatorShortInfo } from '../hooks';
import { useCachedId } from './use-cached-id';
import { ModuleNodeOperator } from './types';

export const useCachedNodeOperator = () => {
  const { address } = useDappStatus();
  const [cachedRef, setCachedRef] = useCachedId();

  const select = useCallback(
    (data: NodeOperatorShortInfo): ModuleNodeOperator | undefined => {
      if (!cachedRef || !address) return undefined;
      if (getNodeOperatorRoles(data, address).length === 0) return undefined;
      return { ...data, module: cachedRef.module };
    },
    [address, cachedRef],
  );

  const result = useOperatorShortInfo<ModuleNodeOperator | undefined>(
    cachedRef?.id,
    select,
    cachedRef?.module,
  );

  // react-query runs `select` during render, so the cached ref can only be
  // evicted afterwards.
  const isStale = !!cachedRef && result.isSuccess && !result.data;
  useEffect(() => {
    if (isStale) setCachedRef(undefined);
  }, [isStale, setCachedRef]);

  return result;
};
