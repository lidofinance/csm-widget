import { useEffect, useMemo, useRef, useState } from 'react';
import { useDappStatus } from '../hooks';
import { resolveActiveOperator } from './resolve-active-operator';
import { useCachedId } from './use-cached-id';
import { useInvalidateOperatorCache } from './use-invalidate-operator-cache';
import { ModuleNodeOperator } from './types';

const sameOperator = (a?: ModuleNodeOperator, b?: ModuleNodeOperator) =>
  !!a && !!b && a.module === b.module && a.nodeOperatorId === b.nodeOperatorId;

export const useActiveNodeOperator = (list?: ModuleNodeOperator[]) => {
  const [active, setActive] = useState<ModuleNodeOperator | undefined>();
  const [cachedRef, setCachedRef] = useCachedId();
  const { address } = useDappStatus();
  const invalidate = useInvalidateOperatorCache();

  const { operator: resolved, needsSelection } = useMemo(
    () => resolveActiveOperator(list, cachedRef, active),
    [list, cachedRef, active],
  );

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
    setActive((prev) => prev && list?.find((item) => sameOperator(item, prev)));
  }, [list]);

  useEffect(() => {
    if (resolved) {
      setCachedRef({ id: resolved.nodeOperatorId, module: resolved.module });
    }
  }, [resolved, setCachedRef]);

  return { nodeOperator: resolved, setActive, needsSelection } as const;
};
