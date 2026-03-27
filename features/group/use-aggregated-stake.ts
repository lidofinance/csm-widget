import { SubOperatorStakeSummary } from '@lidofinance/lido-csm-sdk';
import { useQueries } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useMemo } from 'react';
import { useSmSDK } from 'modules/web3/web3-provider';
import { KEY_OPERATOR_INFO } from 'modules/web3/hooks/use-operator-info';
import { computeStakeData, StakeAndKeysData } from 'utils';

export const useAggregatedStake = (operators: SubOperatorStakeSummary[]) => {
  const { operator } = useSmSDK();

  const infoQueries = useQueries({
    queries: operators.map((op) => ({
      queryKey: [...KEY_OPERATOR_INFO, { nodeOperatorId: op.nodeOperatorId }],
      ...STRATEGY_CONSTANT,
      queryFn: () => operator.getInfo(op.nodeOperatorId),
    })),
  });

  const isPending = infoQueries.some((q) => q.isPending);
  const infoUpdatedAt = infoQueries.map((q) => q.dataUpdatedAt).join(',');

  const { aggregated, totalWeight } = useMemo(() => {
    if (isPending) return { aggregated: undefined, totalWeight: undefined };

    const items = operators.map((op, i) => {
      const info = infoQueries[i]?.data;
      if (!info) return undefined;
      return computeStakeData(op, info);
    });

    const defined = items.filter(
      (item): item is StakeAndKeysData => item !== undefined,
    );
    if (defined.length !== items.length) {
      return { aggregated: undefined, totalWeight: undefined };
    }

    const agg = defined.reduce<StakeAndKeysData>(
      (acc, item) => ({
        activeStake: acc.activeStake + item.activeStake,
        activeKeys: acc.activeKeys + item.activeKeys,
        depositableStake: acc.depositableStake + item.depositableStake,
        depositableKeys: acc.depositableKeys + item.depositableKeys,
        potentialAdditionalStake:
          acc.potentialAdditionalStake + item.potentialAdditionalStake,
        potentialAdditionalKeys:
          acc.potentialAdditionalKeys + item.potentialAdditionalKeys,
      }),
      {
        activeStake: 0n,
        activeKeys: 0,
        depositableStake: 0n,
        depositableKeys: 0,
        potentialAdditionalStake: 0n,
        potentialAdditionalKeys: 0,
      },
    );

    const weight = operators.reduce((sum, op) => sum + op.weight, 0n);

    return { aggregated: agg, totalWeight: weight };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, infoUpdatedAt]);

  const moreKeys = aggregated ? aggregated.potentialAdditionalKeys > 0 : false;

  return { aggregated, totalWeight, moreKeys, isPending };
};
