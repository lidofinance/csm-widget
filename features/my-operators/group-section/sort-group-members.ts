import { compareBigint } from 'utils/bigint-utils';

type SortContext = {
  activeId?: bigint;
  availableIds: ReadonlySet<bigint>;
};

export const sortGroupMembers = <T extends { nodeOperatorId: bigint }>(
  members: readonly T[],
  { activeId, availableIds }: SortContext,
): T[] => {
  const rank = (id: bigint) =>
    id === activeId ? 0 : availableIds.has(id) ? 1 : 2;

  return [...members].sort(
    (a, b) =>
      rank(a.nodeOperatorId) - rank(b.nodeOperatorId) ||
      compareBigint(a.nodeOperatorId, b.nodeOperatorId),
  );
};
