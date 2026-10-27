import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDappStatus } from '../hooks';
import { resolveActiveOperator } from './resolve-active-operator';
import { useCachedId } from './use-cached-id';
import { useInvalidateOperatorCache } from './use-invalidate-operator-cache';
import { ModuleNodeOperator } from './types';

const sameOperator = (a?: ModuleNodeOperator, b?: ModuleNodeOperator) =>
  !!a && !!b && a.module === b.module && a.nodeOperatorId === b.nodeOperatorId;

export const useActiveNodeOperator = (list?: ModuleNodeOperator[]) => {
  const [active, setActiveRaw] = useState<ModuleNodeOperator | undefined>();
  const [dismissed, setDismissed] = useState(false);
  const [cachedRef, setCachedRef] = useCachedId();
  const { address } = useDappStatus();
  const invalidate = useInvalidateOperatorCache();

  const { operator: resolved, needsSelection: rawNeedsSelection } = useMemo(
    () => resolveActiveOperator(list, cachedRef, active),
    [list, cachedRef, active],
  );

  const setActive = useCallback((operator: ModuleNodeOperator) => {
    setDismissed(false);
    setActiveRaw(operator);
  }, []);
  const dismissSelection = useCallback(() => setDismissed(true), []);
  const requestSelection = useCallback(() => setDismissed(false), []);

  const needsSelection = rawNeedsSelection && !dismissed;

  const prevActiveRef = useRef(resolved);
  const prevAddressRef = useRef(address);

  if (address !== prevAddressRef.current) {
    prevAddressRef.current = address;
    prevActiveRef.current = resolved;
    invalidate('operatorAndAddress');
    setDismissed(false);
  } else if (!sameOperator(resolved, prevActiveRef.current)) {
    prevActiveRef.current = resolved;
    invalidate('operator');
  }

  useEffect(() => {
    setActiveRaw(
      (prev) => prev && list?.find((item) => sameOperator(item, prev)),
    );
  }, [list]);

  useEffect(() => {
    if (resolved) {
      setCachedRef({ id: resolved.nodeOperatorId, module: resolved.module });
    }
  }, [resolved, setCachedRef]);

  return {
    nodeOperator: resolved,
    setActive,
    needsSelection,
    selectionDismissed: rawNeedsSelection && dismissed,
    dismissSelection,
    requestSelection,
  } as const;
};
