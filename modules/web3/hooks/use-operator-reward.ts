import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useLidoSDK } from '../web3-provider';
import invariant from 'tiny-invariant';

export const KEY_OPERATOR_REWARDS = ['operator-rewards'];

export const useOperatorRewards = (
  nodeOperatorId: NodeOperatorId | undefined,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: [...KEY_OPERATOR_REWARDS, { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(nodeOperatorId !== undefined);
      return csm.rewards.getRewards(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
  });
};
