import { queryOptions } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { Address } from 'viem';
import {
  OperatorHookArgs,
  OperatorQueryArgs,
  useOperatorQuery,
} from './use-operator-query';

export const KEY_CUSTOM_REWARDS_CLAIMER = ['custom-rewards-claimer'];

export const useCustomRewardsClaimer = <TData = Address>(
  args: OperatorHookArgs<Address, TData>,
) =>
  useOperatorQuery(
    ({ sdk, nodeOperatorId }: OperatorQueryArgs) =>
      queryOptions({
        queryKey: [
          ...KEY_CUSTOM_REWARDS_CLAIMER,
          { nodeOperatorId, module: sdk?.core.moduleName },
        ],
        ...STRATEGY_CONSTANT,
        queryFn: async () => {
          invariant(sdk && nodeOperatorId !== undefined);
          return await sdk.operator.getCustomRewardsClaimer(nodeOperatorId);
        },
        enabled: !!sdk && nodeOperatorId !== undefined,
      }),
    args,
  );
