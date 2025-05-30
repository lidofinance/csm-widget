import { UseFormReturn } from 'react-hook-form';
import { ClaimBondFormInputType } from './types';
import { useEffect } from 'react';
import { TOKENS } from '@lidofinance/lido-csm-sdk/common';

export const useFormRevalidate = ({
  watch,
  trigger,
  setValue,
}: UseFormReturn<ClaimBondFormInputType>) => {
  const [token, claimRewards, unlockClaimTokens] = watch([
    'token',
    'claimRewards',
    'unlockClaimTokens',
  ]);

  useEffect(() => {
    void trigger('amount');
  }, [token, claimRewards, trigger]);

  useEffect(() => {
    if (!unlockClaimTokens) {
      setValue('token', TOKENS.wsteth, {
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [setValue, unlockClaimTokens]);
};
