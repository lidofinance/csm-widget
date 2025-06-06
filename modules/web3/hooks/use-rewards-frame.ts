import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import { useLidoSDK } from '../web3-provider';

export const useRewardsFrame = () => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['rewards-frame'],
    ...STRATEGY_CONSTANT,
    queryFn: () => csm.rewards.getLastFrame(),
  });
};
