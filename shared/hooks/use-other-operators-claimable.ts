import { useQueries } from '@tanstack/react-query';
import {
  operatorBalanceQueryOptions,
  operatorFeeSplitsQueryOptions,
  operatorRewardsQueryOptions,
  useLidoSDK,
  useNodeOperator,
} from 'modules/web3';
import { ModuleNodeOperator } from 'modules/web3/operator-provider/types';
import { isSameOperator } from 'shared/node-operator/utils';
import { useMemo } from 'react';
import { calculateAvailableToClaim } from 'utils';
import { useMyOperators } from './use-my-operators';

export type OtherOperatorClaimable = {
  operator: ModuleNodeOperator;
  amount: bigint;
};

const EMPTY: ModuleNodeOperator[] = [];

/** Operators other than the active one with a positive claimable balance; shares cache with the roster hooks. */
export const useOtherOperatorsClaimable = (): OtherOperatorClaimable[] => {
  const { sm } = useLidoSDK();
  const { nodeOperator: active } = useNodeOperator();
  const { data } = useMyOperators();

  const others = useMemo(
    () => (data ?? EMPTY).filter((op) => !isSameOperator(op, active)),
    [data, active],
  );

  const bonds = useQueries({
    queries: others.map((op) =>
      operatorBalanceQueryOptions({
        sdk: sm[op.module],
        nodeOperatorId: op.nodeOperatorId,
      }),
    ),
  });
  const rewards = useQueries({
    queries: others.map((op) =>
      operatorRewardsQueryOptions({
        sdk: sm[op.module],
        nodeOperatorId: op.nodeOperatorId,
      }),
    ),
  });
  const feeSplits = useQueries({
    queries: others.map((op) =>
      operatorFeeSplitsQueryOptions({
        sdk: sm[op.module],
        nodeOperatorId: op.nodeOperatorId,
      }),
    ),
  });

  // Recompute only when some query's data actually changes.
  const stamp = [...bonds, ...rewards, ...feeSplits]
    .map((q) => q.dataUpdatedAt)
    .join(',');

  return useMemo(
    () =>
      others.reduce<OtherOperatorClaimable[]>((acc, operator, i) => {
        const bond = bonds[i]?.data;
        if (!bond) return acc;
        const amount = calculateAvailableToClaim({
          bond,
          rewards: rewards[i]?.data,
          feeSplits: feeSplits[i]?.data,
        });
        if (amount > 0n) acc.push({ operator, amount });
        return acc;
      }, []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [others, stamp],
  );
};
