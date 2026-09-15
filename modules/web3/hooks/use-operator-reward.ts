import { MODULE_NAME, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { SmSDK, useTargetSmSDK } from '../web3-provider';

export const KEY_OPERATOR_REWARDS = ['operator-rewards'];

export const operatorRewardsQueryOptions = (
  sdk: SmSDK | undefined,
  nodeOperatorId: NodeOperatorId | undefined,
) =>
  queryOptions({
    queryKey: [
      ...KEY_OPERATOR_REWARDS,
      { nodeOperatorId, module: sdk?.core.moduleName },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk && nodeOperatorId !== undefined);
      return sdk.rewards.getRewards(nodeOperatorId);
    },
    enabled: !!sdk && nodeOperatorId !== undefined,
  });

export const useOperatorRewards = (
  nodeOperatorId: NodeOperatorId | undefined,
  module?: MODULE_NAME,
) => {
  const { sdk } = useTargetSmSDK(module);
  return useQuery(operatorRewardsQueryOptions(sdk, nodeOperatorId));
};
