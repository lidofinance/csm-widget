import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useLidoSDK } from '../web3-provider';
import { useDappStatus } from './use-dapp-status';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export const useOperatorLastRewards = (
  nodeOperatorId: NodeOperatorId | undefined,
) => {
  const { csm } = useLidoSDK();
  const { chainId } = useDappStatus();
  const isTestnet = chainId !== CHAINS.Mainnet;

  return useQuery({
    queryKey: ['operator-last-rewards', { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(nodeOperatorId !== undefined);
      return csm.rewards.getOperatorRewardsInLastReport(nodeOperatorId, {
        useCurrentRate: isTestnet,
      });
    },
    enabled: nodeOperatorId !== undefined,
  });
};
