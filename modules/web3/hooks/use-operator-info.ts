import {
  MODULE_NAME,
  NodeOperatorId,
  NodeOperatorInfo,
} from '@lidofinance/lido-csm-sdk';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { SmSDK, useTargetSmSDK } from '../web3-provider';

export const KEY_OPERATOR_INFO = ['operator-info'];

export const operatorInfoQueryOptions = (
  sdk: SmSDK | undefined,
  nodeOperatorId: NodeOperatorId | undefined,
) =>
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
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: NodeOperatorInfo) => TData,
  module?: MODULE_NAME,
) => {
  const { sdk } = useTargetSmSDK(module);
  return useQuery({
    ...operatorInfoQueryOptions(sdk, nodeOperatorId),
    select,
  });
};
