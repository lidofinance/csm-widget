import { OperatorRewards } from '@lidofinance/lido-csm-sdk';
import { queryOptions } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import {
  OperatorHookArgs,
  OperatorQueryArgs,
  useOperatorQuery,
} from './use-operator-query';

export const useOperatorLastRewards = <TData = OperatorRewards | null>(
  args: OperatorHookArgs<OperatorRewards | null, TData>,
) =>
  useOperatorQuery(
    ({ sdk, nodeOperatorId }: OperatorQueryArgs) =>
      queryOptions({
        queryKey: [
          'operator-last-rewards',
          { nodeOperatorId, module: sdk?.core.moduleName },
        ],
        ...STRATEGY_CONSTANT,
        queryFn: async () => {
          invariant(sdk && nodeOperatorId !== undefined);
          return (
            (await sdk.rewards.getOperatorRewardsInLastReport(
              nodeOperatorId,
            )) ?? null
          );
        },
        enabled: !!sdk && nodeOperatorId !== undefined,
      }),
    args,
  );
