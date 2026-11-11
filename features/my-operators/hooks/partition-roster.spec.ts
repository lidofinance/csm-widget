import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { GroupIdResult, RosterRow, partitionRoster } from './partition-roster';

const isCsmFamily = (m: MODULE_NAME) =>
  m === MODULE_NAME.CSM || m === MODULE_NAME.CSM_02;
const isCm = (m: MODULE_NAME) => m === MODULE_NAME.CM;

const cm = (id: bigint): RosterRow => ({
  nodeOperatorId: id,
  module: MODULE_NAME.CM,
});

type Input = {
  roster: RosterRow[];
  groupIds?: [bigint, GroupIdResult][];
  groupMemberIds?: bigint[];
  orphanedReps?: bigint[];
};

const run = ({
  roster,
  groupIds = [],
  groupMemberIds = [],
  orphanedReps = [],
}: Input) => {
  const ids = new Map(groupIds);
  const memberIds = new Set(groupMemberIds);
  const result = partitionRoster({
    roster,
    groupIds: ids,
    groupMemberIds: memberIds,
    orphanedReps: new Set(orphanedReps),
    isCsmFamily,
    isCm,
  });

  const renderedGroupIds = new Set(result.groups.map((g) => g.groupId));
  for (const row of roster) {
    const inCsm = result.csmFamily.includes(row);
    const inUngrouped = result.ungroupedCm.includes(row);
    const groupId = ids.get(row.nodeOperatorId);
    const inGroup =
      row.module === MODULE_NAME.CM &&
      ((typeof groupId === 'bigint' && renderedGroupIds.has(groupId)) ||
        memberIds.has(row.nodeOperatorId));
    expect([inCsm, inUngrouped, inGroup].filter(Boolean)).toHaveLength(1);
  }
  return result;
};

describe('partitionRoster', () => {
  it('keeps CSM and CSM_02 in csmFamily in roster order', () => {
    const roster: RosterRow[] = [
      { nodeOperatorId: 7n, module: MODULE_NAME.CSM_02 },
      { nodeOperatorId: 465n, module: MODULE_NAME.CSM },
    ];
    const result = run({ roster });
    expect(result.csmFamily).toEqual(roster);
    expect(result.groups).toEqual([]);
    expect(result.ungroupedCm).toEqual([]);
  });

  it('collapses a shared group into one lowest-id representative', () => {
    const result = run({
      roster: [cm(3n), cm(5n)],
      groupIds: [
        [3n, 4n],
        [5n, 4n],
      ],
    });
    expect(result.groups).toEqual([{ groupId: 4n, representative: cm(3n) }]);
    expect(result.ungroupedCm).toEqual([]);
  });

  it('orders groups by representative id', () => {
    const result = run({
      roster: [cm(2n), cm(3n), cm(5n)],
      groupIds: [
        [2n, 7n],
        [3n, 4n],
        [5n, 4n],
      ],
    });
    expect(result.groups.map((g) => g.groupId)).toEqual([7n, 4n]);
  });

  it('puts a null group id into ungroupedCm', () => {
    const result = run({ roster: [cm(8n)], groupIds: [[8n, null]] });
    expect(result.ungroupedCm).toEqual([cm(8n)]);
  });

  it('puts an errored group id into ungroupedCm', () => {
    const result = run({ roster: [cm(9n)], groupIds: [[9n, 'error']] });
    expect(result.ungroupedCm).toEqual([cm(9n)]);
  });

  it('does not duplicate an errored operator that is a member of a rendered group', () => {
    const result = run({
      roster: [cm(3n), cm(9n)],
      groupIds: [
        [3n, 4n],
        [9n, 'error'],
      ],
      groupMemberIds: [3n, 9n],
    });
    expect(result.groups).toHaveLength(1);
    expect(result.ungroupedCm).toEqual([]);
  });

  it('drops an orphaned group and lists its wallet rows ungrouped', () => {
    const result = run({
      roster: [cm(3n), cm(5n)],
      groupIds: [
        [3n, 4n],
        [5n, 4n],
      ],
      orphanedReps: [3n],
    });
    expect(result.groups).toEqual([]);
    expect(result.ungroupedCm).toEqual([cm(3n), cm(5n)]);
  });

  it('returns empty groups and ungroupedCm without CM rows', () => {
    const result = run({
      roster: [{ nodeOperatorId: 1n, module: MODULE_NAME.CSM }],
    });
    expect(result.groups).toEqual([]);
    expect(result.ungroupedCm).toEqual([]);
  });
});
