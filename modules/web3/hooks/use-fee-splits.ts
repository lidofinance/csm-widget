import { FeeSplit } from '@lidofinance/lido-csm-sdk';
import { queryOptions } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import {
  OperatorHookArgs,
  OperatorQueryArgs,
  useOperatorQuery,
} from './use-operator-query';

export const KEY_FEE_SPLITS = ['fee-splits'];

export const operatorFeeSplitsQueryOptions = ({
  sdk,
  nodeOperatorId,
}: OperatorQueryArgs) =>
  queryOptions({
    queryKey: [
      ...KEY_FEE_SPLITS,
      { nodeOperatorId, module: sdk?.core.moduleName },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(sdk && nodeOperatorId !== undefined);
      return await sdk.operator.getFeeSplits(nodeOperatorId);
    },
    enabled: !!sdk && nodeOperatorId !== undefined,
  });

export const useFeeSplits = <TData = FeeSplit[]>(
  args: OperatorHookArgs<FeeSplit[], TData>,
) => useOperatorQuery(operatorFeeSplitsQueryOptions, args);
