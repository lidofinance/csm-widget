import { NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDappStatus } from '../hooks';
import { resolveActiveOperator } from './resolve-active-operator';
import { useCachedId } from './use-cached-id';
import { useInvalidateOperatorCache } from './use-invalidate-operator-cache';

export const useActiveNodeOperator = (list?: NodeOperatorShortInfo[]) => {
  const [active, setActive] = useState<NodeOperatorShortInfo | undefined>();
  const [cachedId, setCachedId] = useCachedId();
  const { address } = useDappStatus();
  const invalidate = useInvalidateOperatorCache();

  const { operator: resolved, needsSelection } = useMemo(
    () => resolveActiveOperator(list, cachedId, active),
    [list, cachedId, active],
  );

  const prevActiveRef = useRef(resolved);
  const prevAddressRef = useRef(address);

  if (address !== prevAddressRef.current) {
    prevAddressRef.current = address;
    prevActiveRef.current = resolved;
    invalidate('operatorAndAddress');
  } else if (resolved !== prevActiveRef.current) {
    prevActiveRef.current = resolved;
    invalidate('operator');
  }

  useEffect(() => {
    setActive(
      (prev) =>
        prev &&
        list?.find((item) => item.nodeOperatorId === prev.nodeOperatorId),
    );
  }, [list]);

  useEffect(() => {
    resolved && setCachedId(resolved.nodeOperatorId);
  }, [resolved, setCachedId]);

  return { nodeOperator: resolved, setActive, needsSelection } as const;
};
