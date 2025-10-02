import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useLidoSDK } from 'modules/web3';

export const useStakeLimit = () => {
  const { stake } = useLidoSDK();

  return useQuery({
    queryKey: ['stake-limit'],
    ...STRATEGY_CONSTANT,
    queryFn: () => stake.getStakeLimitInfo(),
    select: (data) => (data.isStakingPaused ? 0n : data.currentStakeLimit),
  });
};
