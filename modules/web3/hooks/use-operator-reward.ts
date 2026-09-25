import { Rewards } from '@lidofinance/lido-csm-sdk';
import { queryOptions } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import {
  OperatorHookArgs,
  OperatorQueryArgs,
  useOperatorQuery,
} from './use-operator-query';

export const KEY_OPERATOR_REWARDS = ['operator-rewards'];

export const operatorRewardsQueryOptions = ({
  sdk,
  nodeOperatorId,
}: OperatorQueryArgs) =>
  queryOptions({
    queryKey: [
      ...KEY_OPERATOR_REWARDS,
      { nodeOperatorId, module: sdk?.core.moduleName },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk && nodeOperatorId !== undefined);
      return sdk.rewards.getRewards(nodeOperatorId);
    },
    enabled: !!sdk && nodeOperatorId !== undefined,
  });

export const useOperatorRewards = <TData = Rewards>(
  args: OperatorHookArgs<Rewards, TData>,
) => useOperatorQuery(operatorRewardsQueryOptions, args);
