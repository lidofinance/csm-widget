import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { ClaimBondFormInputType } from './types';

export const ClaimBondUpdater: FC = () => {
  const [token, claimRewards, unlockedClaimTokens] = useWatch<
    ClaimBondFormInputType,
    ['token', 'claimRewards', 'unlockedClaimTokens']
  >({ name: ['token', 'claimRewards', 'unlockedClaimTokens'] });

  const { trigger, setValue } = useFormContext<ClaimBondFormInputType>();

  useEffect(() => {
    void trigger('amount');
    // trigger is stable ref and shouldn't be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, claimRewards]);

  useEffect(() => {
    if (!unlockedClaimTokens) {
      setValue('token', TOKENS.wsteth, {
        shouldTouch: true,
        shouldValidate: true,
      });
    }
    // setValue is stable ref and shouldn't be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockedClaimTokens]);

  return null;
};
