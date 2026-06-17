import { useEffect, useRef, useState } from 'react';
import { useDappStatus } from '../hooks';
import { useCachedId } from './use-cached-id';
import { useInvalidateOperatorCache } from './use-invalidate-operator-cache';
import { ModuleNodeOperator } from './types';

const sameOperator = (a?: ModuleNodeOperator, b?: ModuleNodeOperator) =>
  !!a && !!b && a.module === b.module && a.nodeOperatorId === b.nodeOperatorId;

export const useActiveNodeOperator = (list?: ModuleNodeOperator[]) => {
  const [active, setActive] = useState<ModuleNodeOperator | undefined>();
  const [, setCachedRef] = useCachedId();
  const { address } = useDappStatus();
  const invalidate = useInvalidateOperatorCache();

  const resolved = active ?? list?.[0];

  const prevActiveRef = useRef(resolved);
  const prevAddressRef = useRef(address);

  if (address !== prevAddressRef.current) {
    prevAddressRef.current = address;
    prevActiveRef.current = resolved;
    invalidate('operatorAndAddress');
  } else if (!sameOperator(resolved, prevActiveRef.current)) {
    prevActiveRef.current = resolved;
    invalidate('operator');
  }

  useEffect(() => {
    setActive((prev) => {
      const updated = list?.find((item) => sameOperator(item, prev));
      return updated ?? list?.[0];
    });
  }, [list]);

  useEffect(() => {
    if (resolved) {
      setCachedRef({ id: resolved.nodeOperatorId, module: resolved.module });
    }
  }, [resolved, setCachedRef]);

  return [resolved, setActive] as const;
};
