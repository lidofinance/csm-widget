import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useLidoSDK } from 'modules/web3';

export const KEY_STAKE_LIMIT = ['stake-limit'];

export const useStakeLimit = () => {
  const { stake } = useLidoSDK();

  return useQuery({
    queryKey: KEY_STAKE_LIMIT,
    ...STRATEGY_CONSTANT,
    queryFn: () => stake.getStakeLimitInfo(),
    select: (data) => (data.isStakingPaused ? 0n : data.currentStakeLimit),
  });
};
