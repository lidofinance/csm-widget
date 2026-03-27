import {
  MODULE_NAME,
  NodeOperatorShortInfo,
  SubOperatorStakeSummary,
} from '@lidofinance/lido-csm-sdk';
import { useQueries } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useMemo } from 'react';
import { useSmSDK } from 'modules/web3/web3-provider';
import { KEY_OPERATOR_GROUP_ID } from 'modules/web3/hooks/use-operator-group-id';
import { KEY_OPERATOR_GROUP_SUMMARY } from 'modules/web3/hooks/use-operator-group-stake-summary';

export type OperatorGroupData = {
  groupId: bigint;
  stakeSummaries: Map<bigint, SubOperatorStakeSummary>;
  allOperatorIds: bigint[];
  availableIds: Set<bigint>;
};

export type GroupedOperatorsResult = {
  groups: OperatorGroupData[];
  ungrouped: NodeOperatorShortInfo[];
  isPending: boolean;
};

export const useGroupedOperators = (
  list: NodeOperatorShortInfo[],
): GroupedOperatorsResult => {
  const sdk = useSmSDK(MODULE_NAME.CM);

  // Stage 1: fetch groupId per operator
  const groupIdResults = useQueries({
    queries: sdk
      ? list.map((op) => ({
          queryKey: [
            ...KEY_OPERATOR_GROUP_ID,
            { nodeOperatorId: op.nodeOperatorId },
          ],
          ...STRATEGY_CONSTANT,
          queryFn: () => sdk.metaRegistry.getOperatorGroupId(op.nodeOperatorId),
        }))
      : [],
  });

  const stage1Pending = groupIdResults.some((q) => q.isPending);
  const stage1UpdatedAt = groupIdResults.map((q) => q.dataUpdatedAt).join(',');

  // Derive unique groups and partition operators
  const { groupRepresentatives, ungroupedOps } = useMemo(() => {
    if (stage1Pending || !sdk) {
      return {
        groupRepresentatives: [] as {
          groupId: bigint;
          representativeId: bigint;
        }[],
        ungroupedOps: [] as NodeOperatorShortInfo[],
      };
    }

    const groupSet = new Map<bigint, bigint>(); // groupId → first operatorId
    const ungrouped: NodeOperatorShortInfo[] = [];

    list.forEach((op, i) => {
      const groupId = groupIdResults[i]?.data;
      if (groupId) {
        if (!groupSet.has(groupId)) {
          groupSet.set(groupId, op.nodeOperatorId);
        }
      } else {
        ungrouped.push(op);
      }
    });

    const reps = Array.from(groupSet.entries()).map(
      ([groupId, representativeId]) => ({
        groupId,
        representativeId,
      }),
    );

    return {
      groupRepresentatives: reps,
      ungroupedOps: ungrouped,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage1Pending, stage1UpdatedAt, sdk]);

  // Stage 2: fetch group stake summaries for unique groups
  const groupSummaryResults = useQueries({
    queries:
      sdk && !stage1Pending
        ? groupRepresentatives.map((rep) => ({
            queryKey: [
              ...KEY_OPERATOR_GROUP_SUMMARY,
              { nodeOperatorId: rep.representativeId },
            ],
            ...STRATEGY_CONSTANT,
            queryFn: () =>
              sdk.metaRegistry.getOperatorGroupStakeSummary(
                rep.representativeId,
              ),
          }))
        : [],
  });

  const stage2Pending = groupSummaryResults.some((q) => q.isPending);
  const stage2UpdatedAt = groupSummaryResults
    .map((q) => q.dataUpdatedAt)
    .join(',');

  // Build final grouped structure
  const groups = useMemo(() => {
    if (stage1Pending || stage2Pending || !sdk) return [];

    const availableIdSet = new Set(list.map((op) => op.nodeOperatorId));

    return groupRepresentatives
      .map((rep, i) => {
        const summary = groupSummaryResults[i]?.data;
        if (!summary) return undefined;

        const stakeSummaries = new Map<bigint, SubOperatorStakeSummary>();
        const allOperatorIds: bigint[] = [];
        const availableIds = new Set<bigint>();

        for (const op of summary.operators) {
          stakeSummaries.set(op.nodeOperatorId, op);
          allOperatorIds.push(op.nodeOperatorId);
          if (availableIdSet.has(op.nodeOperatorId)) {
            availableIds.add(op.nodeOperatorId);
          }
        }

        return {
          groupId: summary.groupId,
          stakeSummaries,
          allOperatorIds,
          availableIds,
        } as OperatorGroupData;
      })
      .filter((g): g is OperatorGroupData => g !== undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage1Pending, stage2Pending, stage2UpdatedAt, sdk]);

  return {
    groups,
    ungrouped: ungroupedOps,
    isPending:
      !sdk ||
      stage1Pending ||
      (groupRepresentatives.length > 0 && stage2Pending),
  };
};
