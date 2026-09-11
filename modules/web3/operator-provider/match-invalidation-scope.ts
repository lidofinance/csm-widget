export type InvalidationScope = 'operator' | 'address' | 'operatorAndAddress';

const isRecord = (part: unknown): part is Record<string, unknown> =>
  typeof part === 'object' && part !== null;

/** Whether a React Query key carries a part the given invalidation scope covers. */
export const matchesInvalidationScope = (
  queryKey: readonly unknown[],
  scope: InvalidationScope,
): boolean =>
  queryKey.some((part) => {
    if (!isRecord(part)) return false;
    const byOperator = 'operator' in part || 'nodeOperatorId' in part;
    const byAddress = 'address' in part;
    if (scope === 'operator') return byOperator;
    if (scope === 'address') return byAddress;
    return byOperator || byAddress;
  });
