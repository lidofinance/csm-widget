import { KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { queryOptions } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import {
  OperatorHookArgs,
  OperatorQueryArgs,
  useOperatorQuery,
} from './use-operator-query';

export const KEY_OPERATOR_KEYS = ['operator-keys'];

export const operatorKeysQueryOptions = ({
  sdk,
  nodeOperatorId,
}: OperatorQueryArgs) =>
  queryOptions({
    queryKey: [
      ...KEY_OPERATOR_KEYS,
      { nodeOperatorId, module: sdk?.core.moduleName },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(sdk && nodeOperatorId !== undefined);
      return sdk.keysWithStatus.getKeys(nodeOperatorId);
    },
    enabled: !!sdk && nodeOperatorId !== undefined,
  });

export const useOperatorKeysWithStatus = <TData = KeyWithStatus[]>(
  args: OperatorHookArgs<KeyWithStatus[], TData>,
) => useOperatorQuery(operatorKeysQueryOptions, args);
