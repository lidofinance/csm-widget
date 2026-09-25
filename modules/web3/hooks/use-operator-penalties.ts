import { PenaltyRecord } from '@lidofinance/lido-csm-sdk';
import { queryOptions } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import {
  OperatorHookArgs,
  OperatorQueryArgs,
  useOperatorQuery,
} from './use-operator-query';

export const KEY_OPERATOR_PENALTIES = ['operator-penalties'];

export const useOperatorPenalties = <TData = PenaltyRecord[]>(
  args: OperatorHookArgs<PenaltyRecord[], TData>,
) =>
  useOperatorQuery(
    ({ sdk, nodeOperatorId }: OperatorQueryArgs) =>
      queryOptions({
        queryKey: [
          ...KEY_OPERATOR_PENALTIES,
          { nodeOperatorId, module: sdk?.core.moduleName },
        ],
        ...STRATEGY_CONSTANT,
        queryFn: () => {
          invariant(sdk && nodeOperatorId !== undefined);
          return sdk.events.getPenalties(nodeOperatorId);
        },
        enabled: !!sdk && nodeOperatorId !== undefined,
      }),
    args,
  );
