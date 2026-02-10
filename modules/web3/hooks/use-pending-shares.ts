import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const KEY_PENDING_SHARES = ['pending-shares-to-split'];

export const usePendingSharesToSplit = (
  nodeOperatorId: NodeOperatorId | undefined,
) => {
  const { operator } = useSmSDK();

  return useQuery({
    queryKey: [...KEY_PENDING_SHARES, { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(nodeOperatorId !== undefined);
      return await operator.getPendingSharesToSplit(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
  });
};
