import {
  KeyWithStatus,
  MODULE_NAME,
  NodeOperatorId,
} from '@lidofinance/lido-csm-sdk';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { SmSDK, useTargetSmSDK } from '../web3-provider';

export const KEY_OPERATOR_KEYS = ['operator-keys'];

export const operatorKeysQueryOptions = (
  sdk: SmSDK | undefined,
  nodeOperatorId: NodeOperatorId | undefined,
) =>
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
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: KeyWithStatus[]) => TData,
  module?: MODULE_NAME,
) => {
  const { sdk } = useTargetSmSDK(module);
  return useQuery({
    ...operatorKeysQueryOptions(sdk, nodeOperatorId),
    select,
  });
};
