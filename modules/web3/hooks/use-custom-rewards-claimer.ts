import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const KEY_CUSTOM_REWARDS_CLAIMER = ['custom-rewards-claimer'];

export const useCustomRewardsClaimer = (
  nodeOperatorId: NodeOperatorId | undefined,
) => {
  const { operator } = useSmSDK();

  return useQuery({
    queryKey: [...KEY_CUSTOM_REWARDS_CLAIMER, { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(nodeOperatorId !== undefined);
      return await operator.getCustomRewardsClaimer(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
  });
};
