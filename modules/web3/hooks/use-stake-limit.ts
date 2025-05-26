import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import { useLidoSDK } from 'modules/web3';

export const useStakeLimit = () => {
  const { stake } = useLidoSDK();

  return useQuery({
    queryKey: ['getStakeLimitInfo'],
    ...STRATEGY_CONSTANT,
    queryFn: () => stake.getStakeLimitInfo(),
    select: (data) => (data.isStakingPaused ? 0n : data.currentStakeLimit),
  });
};
