import {
  MODULE_NAME,
  NodeOperatorInfo,
  SubOperatorStakeSummary,
} from '@lidofinance/lido-csm-sdk';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useSmSDK } from 'modules/web3/web3-provider';
import { operatorInfoQueryOptions } from 'modules/web3/hooks/use-operator-info';
import { selectGroupTotals } from 'shared/components/stake-allocation';
import { computeStakeData, StakeAndKeysData } from 'utils';

export type GroupMemberStake = {
  summary: SubOperatorStakeSummary;
  info: NodeOperatorInfo | undefined;
  stake: StakeAndKeysData | undefined;
  isInfoError: boolean;
};

export const useGroupStake = (operators: SubOperatorStakeSummary[]) => {
  const sdk = useSmSDK(MODULE_NAME.CM);

  const infoQueries = useQueries({
    queries: operators.map((op) =>
      operatorInfoQueryOptions({ sdk, nodeOperatorId: op.nodeOperatorId }),
    ),
  });

  const isPending = infoQueries.some((q) => q.isPending);
  const isError = infoQueries.some((q) => q.isError);
  const stamp = infoQueries
    .map((q) => `${q.dataUpdatedAt}:${q.isError ? 1 : 0}`)
    .join(',');

  return useMemo(() => {
    const members: GroupMemberStake[] = operators.map((summary, i) => {
      const info = infoQueries[i]?.data;
      return {
        summary,
        info,
        stake: info ? computeStakeData(summary, info) : undefined,
        isInfoError: !!infoQueries[i]?.isError,
      };
    });

    const stakes = members.map((m) => m.stake);
    const totals = stakes.every((s): s is StakeAndKeysData => !!s)
      ? selectGroupTotals(stakes)
      : undefined;
    const totalWeight = operators.reduce((sum, op) => sum + op.weight, 0n);

    return { members, totals, totalWeight, isPending, isError };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operators, stamp, isPending, isError]);
};
