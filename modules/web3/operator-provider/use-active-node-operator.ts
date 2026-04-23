import { useEffect, useRef, useState } from 'react';
import { useCachedId } from './use-cached-id';
import { NodeOperator } from '@lidofinance/lido-csm-sdk';
import { useDappStatus } from '../hooks';
import { useInvalidateOperatorCache } from './use-invalidate-operator-cache';

export const useActiveNodeOperator = (list?: NodeOperator[]) => {
  const [active, setActive] = useState<NodeOperator | undefined>();
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
      const updated = list?.find((item) => item.id === prev?.id);

      return updated ?? list?.[0];
    });
  }, [list]);

  useEffect(() => {
    resolved && setCachedId(resolved.id);
  }, [resolved, setCachedId]);

  return [resolved, setActive] as const;
};
