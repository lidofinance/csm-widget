import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import { useLidoSDK } from '../web3-provider';

export const useOperatorRewards = (id: NodeOperatorId | undefined) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['node-operator-rewards', { id }],
    ...STRATEGY_CONSTANT,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: () => csm.rewards.getRewards(id!),
    enabled: id !== undefined,
  });
};
