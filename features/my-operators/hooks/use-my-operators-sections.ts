import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { CSM_FAMILY_MODULES } from 'consts';
import { operatorGroupStakeSummaryQueryOptions } from 'modules/web3/hooks/use-operator-group-stake-summary';
import { ModuleNodeOperator } from 'modules/web3/operator-provider/types';
import { useSmSDK } from 'modules/web3/web3-provider';
import { partitionRoster, pickGroupRepresentatives } from './partition-roster';
import type { RosterGroup } from './partition-roster';
import { useMyGroupIds } from './use-my-group-ids';

const EMPTY: ModuleNodeOperator[] = [];

export const useMyOperatorsSections = (
  roster: ModuleNodeOperator[] | undefined,
): {
  cmPending: boolean;
  groups: RosterGroup<ModuleNodeOperator>[];
  ungroupedCm: ModuleNodeOperator[];
  csmFamily: ModuleNodeOperator[];
} => {
  const sdk = useSmSDK(MODULE_NAME.CM);
  const rows = roster ?? EMPTY;

  const cmOps = useMemo(
    () => rows.filter((op) => op.module === MODULE_NAME.CM),
    [rows],
  );
  const { groupIds, isPending: groupIdsPending } = useMyGroupIds(cmOps);

  const reps = useMemo(
    () => (groupIdsPending ? [] : pickGroupRepresentatives(cmOps, groupIds)),
    [cmOps, groupIds, groupIdsPending],
  );

  const summaries = useQueries({
    queries: reps.map((r) =>
      operatorGroupStakeSummaryQueryOptions({
        sdk,
        nodeOperatorId: r.representative.nodeOperatorId,
      }),
    ),
  });

  const summariesPending = summaries.some((q) => q.isPending);
  const cmPending = groupIdsPending || summariesPending;
  const stamp = summaries
    .map((q) => `${q.status}:${q.dataUpdatedAt}`)
    .join(',');

  const partition = useMemo(() => {
    const groupMemberIds = new Set<bigint>();
    const orphanedReps = new Set<bigint>();
    reps.forEach((r, i) => {
      const q = summaries[i];
      if (!q || q.isPending || q.isError) return;
      if (!q.data) {
        orphanedReps.add(r.representative.nodeOperatorId);
        return;
      }
      q.data.operators.forEach((m) => groupMemberIds.add(m.nodeOperatorId));
    });

    return partitionRoster({
      roster: rows,
      groupIds,
      groupMemberIds,
      orphanedReps,
      isCsmFamily: (m) => CSM_FAMILY_MODULES.includes(m),
      isCm: (m) => m === MODULE_NAME.CM,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, groupIds, reps, stamp]);

  return { cmPending, ...partition };
};
