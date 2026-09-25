import { OperatorRewardsHistory } from '@lidofinance/lido-csm-sdk';
import { queryOptions } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import {
  OperatorHookArgs,
  OperatorQueryArgs,
  useOperatorQuery,
} from './use-operator-query';

export const KEY_OPERATOR_REWARDS_HISTORY = ['operator-rewards-history'];

export const useOperatorRewardsHistory = <TData = OperatorRewardsHistory>(
  args: OperatorHookArgs<OperatorRewardsHistory, TData>,
) =>
  useOperatorQuery(
    ({ sdk, nodeOperatorId }: OperatorQueryArgs) =>
      queryOptions({
        queryKey: [
          ...KEY_OPERATOR_REWARDS_HISTORY,
          { nodeOperatorId, module: sdk?.core.moduleName },
        ],
        ...STRATEGY_CONSTANT,
        queryFn: async () => {
          invariant(sdk && nodeOperatorId !== undefined);
          return sdk.rewards.getOperatorRewardsHistory(nodeOperatorId);
        },
        enabled: !!sdk && nodeOperatorId !== undefined,
      }),
    args,
  );
