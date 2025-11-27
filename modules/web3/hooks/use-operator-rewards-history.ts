import {
  NodeOperatorId,
  OperatorRewardsHistory,
} from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useLidoSDK } from '../web3-provider';
import { useDappStatus } from './use-dapp-status';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export const KEY_OPERATOR_REWARDS_HISTORY = ['operator-rewards-history'];

export const useOperatorRewardsHistory = <TData = OperatorRewardsHistory>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: OperatorRewardsHistory) => TData,
) => {
  const { csm } = useLidoSDK();
  const { chainId } = useDappStatus();
  const isTestnet = chainId !== CHAINS.Mainnet;

  return useQuery({
    queryKey: [...KEY_OPERATOR_REWARDS_HISTORY, { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(nodeOperatorId !== undefined);
      return csm.rewards.getOperatorRewardsHistory(nodeOperatorId, {
        useCurrentRate: isTestnet,
      });
    },
    enabled: nodeOperatorId !== undefined,
    select,
  });
};
