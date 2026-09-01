import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const useOperatorLastRewards = (
  nodeOperatorId: NodeOperatorId | undefined,
) => {
  const { rewards, core } = useSmSDK();

  return useQuery({
    queryKey: [
      'operator-last-rewards',
      { nodeOperatorId, module: core.moduleName },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(nodeOperatorId !== undefined);
      return (
        (await rewards.getOperatorRewardsInLastReport(nodeOperatorId)) ?? null
      );
    },
    enabled: nodeOperatorId !== undefined,
  });
};
