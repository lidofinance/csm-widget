import { MODULE_NAME, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { SmSDK, useTargetSmSDK } from '../web3-provider';

export const KEY_FEE_SPLITS = ['fee-splits'];

export const operatorFeeSplitsQueryOptions = (
  sdk: SmSDK | undefined,
  nodeOperatorId: NodeOperatorId | undefined,
) =>
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

export const useFeeSplits = (
  nodeOperatorId: NodeOperatorId | undefined,
  module?: MODULE_NAME,
) => {
  const { sdk } = useTargetSmSDK(module);
  return useQuery(operatorFeeSplitsQueryOptions(sdk, nodeOperatorId));
};
