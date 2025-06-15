import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import invariant from 'tiny-invariant';
import { useLidoSDK } from '../web3-provider';

export const useOperatorLastRewards = (nodeOperatorId?: NodeOperatorId) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['operator-last-rewards', { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(nodeOperatorId !== undefined);
      return csm.rewards.getOperatorRewardsInLastReport(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
  });
};
