import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const KEY_OPERATOR_REWARDS = ['operator-rewards'];

export const useOperatorRewards = (
  nodeOperatorId: NodeOperatorId | undefined,
) => {
  const { rewards } = useSmSDK();

  return useQuery({
    queryKey: [...KEY_OPERATOR_REWARDS, { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(nodeOperatorId !== undefined);
      return rewards.getRewards(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
  });
};
