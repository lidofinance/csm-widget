import { queryOptions } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import {
  OperatorHookArgs,
  OperatorQueryArgs,
  useOperatorQuery,
} from './use-operator-query';

export const KEY_IS_LOCK_EXPIRED = ['is-lock-expired'];

export const useIsLockExpired = <TData = boolean>(
  args: OperatorHookArgs<boolean, TData>,
) =>
  useOperatorQuery(
    ({ sdk, nodeOperatorId }: OperatorQueryArgs) =>
      queryOptions({
        queryKey: [
          ...KEY_IS_LOCK_EXPIRED,
          { nodeOperatorId, module: sdk?.core.moduleName },
        ],
        ...STRATEGY_CONSTANT,
        queryFn: () => {
          invariant(sdk && nodeOperatorId !== undefined);
          return sdk.operator.isLockExpired(nodeOperatorId);
        },
        enabled: !!sdk && nodeOperatorId !== undefined,
      }),
    args,
  );
