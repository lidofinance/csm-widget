import { NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';
import { useEffect, useRef, useState } from 'react';
import { useDappStatus } from '../hooks';
import { useCachedId } from './use-cached-id';
import { useInvalidateOperatorCache } from './use-invalidate-operator-cache';

export const useActiveNodeOperator = (list?: NodeOperatorShortInfo[]) => {
  const [active, setActive] = useState<NodeOperatorShortInfo | undefined>();
  const [, setCachedId] = useCachedId();
  const { address } = useDappStatus();
  const invalidate = useInvalidateOperatorCache();

  const resolved = active ?? list?.[0];

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
    setActive((prev) => {
      const updated = list?.find(
        (item) => item.nodeOperatorId === prev?.nodeOperatorId,
      );

      return updated ?? list?.[0];
    });
  }, [list]);

  useEffect(() => {
    resolved && setCachedId(resolved.nodeOperatorId);
  }, [resolved, setCachedId]);

  return [resolved, setActive] as const;
};
