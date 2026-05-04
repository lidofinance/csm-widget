import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const KEY_FEE_SPLITS = ['fee-splits'];

export const useFeeSplits = (nodeOperatorId: NodeOperatorId | undefined) => {
  const { operator } = useSmSDK();

  return useQuery({
    queryKey: [...KEY_FEE_SPLITS, { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(nodeOperatorId !== undefined);
      return await operator.getFeeSplits(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
  });
};
