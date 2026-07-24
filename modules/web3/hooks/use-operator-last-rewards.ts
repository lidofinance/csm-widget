import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const useOperatorLastRewards = (
  nodeOperatorId: NodeOperatorId | undefined,
) => {
  const { rewards } = useSmSDK();

  return useQuery({
    queryKey: ['operator-last-rewards', { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(nodeOperatorId !== undefined);
      return rewards.getOperatorRewardsInLastReport(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
  });
};
