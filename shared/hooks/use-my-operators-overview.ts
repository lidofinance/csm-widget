import { useQueries } from '@tanstack/react-query';
import {
  operatorBalanceQueryOptions,
  operatorFeeSplitsQueryOptions,
  operatorKeysQueryOptions,
  operatorRewardsQueryOptions,
  useLidoSDK,
} from 'modules/web3';
import { ModuleNodeOperator } from 'modules/web3/operator-provider/types';
import { useMemo } from 'react';
import { aggregateOperatorsOverview, OperatorOverviewInput } from 'utils';
import { useMyOperators } from './use-my-operators';

const EMPTY: ModuleNodeOperator[] = [];

/** Cross-operator totals for the summary card and nav counter; shares cache with the cards. */
export const useMyOperatorsOverview = () => {
  const { sm } = useLidoSDK();
  const { data, isPending: isRosterPending } = useMyOperators();
  const operators = data ?? EMPTY;

  const keys = useQueries({
    queries: operators.map((op) =>
      operatorKeysQueryOptions(sm[op.module], op.nodeOperatorId),
    ),
  });
  const bonds = useQueries({
    queries: operators.map((op) =>
      operatorBalanceQueryOptions(sm[op.module], op.nodeOperatorId),
    ),
  });
  const rewards = useQueries({
    queries: operators.map((op) =>
      operatorRewardsQueryOptions(sm[op.module], op.nodeOperatorId),
    ),
  });
  const feeSplits = useQueries({
    queries: operators.map((op) =>
      operatorFeeSplitsQueryOptions(sm[op.module], op.nodeOperatorId),
    ),
  });

  const isPending =
    isRosterPending ||
    [...keys, ...bonds, ...rewards, ...feeSplits].some((q) => q.isPending);

  // Recompute only when some query's data actually changes.
  const stamp = [...keys, ...bonds, ...rewards, ...feeSplits]
    .map((q) => q.dataUpdatedAt)
    .join(',');

  const summary = useMemo(
    () =>
      aggregateOperatorsOverview(
        operators.map<OperatorOverviewInput>((_op, i) => ({
          keys: keys[i]?.data,
          bond: bonds[i]?.data,
          rewards: rewards[i]?.data,
          feeSplits: feeSplits[i]?.data,
        })),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [operators, stamp],
  );

  return { ...summary, operators, isPending };
};
