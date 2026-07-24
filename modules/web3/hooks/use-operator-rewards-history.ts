import {
  NodeOperatorId,
  OperatorRewardsHistory,
} from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const KEY_OPERATOR_REWARDS_HISTORY = ['operator-rewards-history'];

export const useOperatorRewardsHistory = <TData = OperatorRewardsHistory>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: OperatorRewardsHistory) => TData,
) => {
  const { rewards } = useSmSDK();

  return useQuery({
    queryKey: [...KEY_OPERATOR_REWARDS_HISTORY, { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(nodeOperatorId !== undefined);
      return rewards.getOperatorRewardsHistory(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
    select,
  });
};
