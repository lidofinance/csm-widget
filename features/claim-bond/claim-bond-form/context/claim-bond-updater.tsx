import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { CLAIM_OPTION, ClaimBondFormInputType } from './types';
import { useClaimBondFormData } from './claim-bond-data-provider';

export const ClaimBondUpdater: FC = () => {
  const [token, claimOption, unlockedClaimTokens] = useWatch<
    ClaimBondFormInputType,
    ['token', 'claimOption', 'unlockedClaimTokens']
  >({ name: ['token', 'claimOption', 'unlockedClaimTokens'] });

  const { trigger, setValue } = useFormContext<ClaimBondFormInputType>();
  const { isContract, bond, rewards, availableOptions } =
    useClaimBondFormData();

  useEffect(() => {
    void trigger('amount');
    // trigger is stable ref and shouldn't be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, claimOption]);

  useEffect(() => {
    if (!unlockedClaimTokens && isContract) {
      setValue('token', TOKENS.wsteth, {
        shouldTouch: true,
        shouldValidate: true,
      });
    }
    // setValue is stable ref and shouldn't be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockedClaimTokens]);

  useEffect(() => {
    if (!bond || !rewards || !availableOptions) return;
    if (availableOptions.includes(claimOption)) return;
    setValue('claimOption', availableOptions[0] ?? CLAIM_OPTION.BOND_TO_RA, {
      shouldTouch: true,
      shouldValidate: true,
    });
    // setValue is stable ref and shouldn't be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bond, rewards, claimOption]);

  return null;
};
