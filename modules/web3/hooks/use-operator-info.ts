import { NodeOperatorInfo } from '@lidofinance/lido-csm-sdk';
import { queryOptions } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import {
  OperatorHookArgs,
  OperatorQueryArgs,
  useOperatorQuery,
} from './use-operator-query';

export const KEY_OPERATOR_INFO = ['operator-info'];

export const operatorInfoQueryOptions = ({
  sdk,
  nodeOperatorId,
}: OperatorQueryArgs) =>
  queryOptions({
    queryKey: [
      ...KEY_OPERATOR_INFO,
      { nodeOperatorId, module: sdk?.core.moduleName },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(sdk && nodeOperatorId !== undefined);
      return await sdk.operator.getInfo(nodeOperatorId);
    },
    enabled: !!sdk && nodeOperatorId !== undefined,
  });

export const useOperatorInfo = <TData = NodeOperatorInfo>(
  args: OperatorHookArgs<NodeOperatorInfo, TData>,
) => useOperatorQuery(operatorInfoQueryOptions, args);
