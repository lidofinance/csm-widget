import type { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { compareBigint } from 'utils/bigint-utils';

export type RosterRow = { nodeOperatorId: bigint; module: MODULE_NAME };
export type GroupIdResult = bigint | null | 'error';
export type RosterGroup<T> = { groupId: bigint; representative: T };

/** One entry per distinct group id; the representative is the lowest-id wallet operator; sorted by representative id. */
export const pickGroupRepresentatives = <T extends RosterRow>(
  cmOps: readonly T[],
  groupIds: ReadonlyMap<bigint, GroupIdResult>,
): RosterGroup<T>[] => {
  const byGroup = new Map<bigint, T>();
  for (const op of cmOps) {
    const groupId = groupIds.get(op.nodeOperatorId);
    if (typeof groupId !== 'bigint') continue;
    const current = byGroup.get(groupId);
    if (!current || op.nodeOperatorId < current.nodeOperatorId) {
      byGroup.set(groupId, op);
    }
  }
  return [...byGroup.entries()]
    .map(([groupId, representative]) => ({ groupId, representative }))
    .sort((a, b) =>
      compareBigint(
        a.representative.nodeOperatorId,
        b.representative.nodeOperatorId,
      ),
    );
};

export const partitionRoster = <T extends RosterRow>({
  roster,
  groupIds,
  groupMemberIds,
  orphanedReps,
  isCsmFamily,
  isCm,
}: {
  roster: readonly T[];
  groupIds: ReadonlyMap<bigint, GroupIdResult>;
  groupMemberIds: ReadonlySet<bigint>;
  orphanedReps: ReadonlySet<bigint>;
  isCsmFamily: (module: MODULE_NAME) => boolean;
  isCm: (module: MODULE_NAME) => boolean;
}): { groups: RosterGroup<T>[]; ungroupedCm: T[]; csmFamily: T[] } => {
  const csmFamily = roster.filter((row) => isCsmFamily(row.module));
  const cmRows = roster.filter((row) => isCm(row.module));
  const groups = pickGroupRepresentatives(cmRows, groupIds).filter(
    ({ representative }) => !orphanedReps.has(representative.nodeOperatorId),
  );
  const renderedGroupIds = new Set(groups.map(({ groupId }) => groupId));

  const ungroupedCm = cmRows.filter((row) => {
    const groupId = groupIds.get(row.nodeOperatorId);
    if (typeof groupId === 'bigint' && renderedGroupIds.has(groupId)) {
      return false;
    }
    return !groupMemberIds.has(row.nodeOperatorId);
  });

  return { groups, ungroupedCm, csmFamily };
};
