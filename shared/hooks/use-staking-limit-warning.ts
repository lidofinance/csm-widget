import { LIMIT_LEVEL } from 'types';
import { useAccount } from './use-account';

export const useStakingLimitWarning = (stakingLimitLevel?: LIMIT_LEVEL) => {
  const { active } = useAccount();
  const limitWarning =
    stakingLimitLevel === LIMIT_LEVEL.WARN && active
      ? 'Stake limit is almost exhausted. Your transaction may not go through.'
      : null;

  const limitError =
    stakingLimitLevel === LIMIT_LEVEL.REACHED && active
      ? 'Stake limit is exhausted. Please wait until the limit is restored.'
      : null;

  return { limitWarning, limitError };
};
