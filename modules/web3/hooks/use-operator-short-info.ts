import { NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';
import { queryOptions } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import {
  OperatorHookArgs,
  OperatorQueryArgs,
  useOperatorQuery,
} from './use-operator-query';
import { KEY_OPERATOR_INFO } from './use-operator-info';

export const useOperatorShortInfo = <TData = NodeOperatorShortInfo>(
  args: OperatorHookArgs<NodeOperatorShortInfo, TData>,
) =>
  useOperatorQuery(
    ({ sdk, nodeOperatorId }: OperatorQueryArgs) =>
      queryOptions({
        queryKey: [
          ...KEY_OPERATOR_INFO,
          'short',
          { nodeOperatorId, module: sdk?.core.moduleName },
        ],
        ...STRATEGY_CONSTANT,
        queryFn: async () => {
          invariant(nodeOperatorId !== undefined && sdk);
          return await sdk.operator.getManagementProperties(nodeOperatorId);
        },
        enabled: nodeOperatorId !== undefined && !!sdk,
      }),
    args,
  );
