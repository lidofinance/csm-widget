import {
  useFormValidation,
  validateBigintMax,
  validateEtherAmount,
} from 'shared/hook-form/validation';
import { getTokenDisplayName } from 'utils';
import { formatEther } from 'viem';
import type { ClaimBondFormInputType, ClaimBondFormNetworkData } from './types';

export const useClaimBondValidation = () => {
  return useFormValidation<ClaimBondFormInputType, ClaimBondFormNetworkData>(
    'token',
    async (
      { token, amount, claimRewards },
      { maxValues, rewards },
      validate,
    ) => {
      // FIXME: validate on submit that token and amount is defined

      await validate('amount', () => {
        validateEtherAmount(
          'amount',
          amount,
          token,
          Boolean(claimRewards && rewards?.available),
        );

        const maxAmount = maxValues?.[token][Number(claimRewards)];
        if (amount && maxAmount)
          validateBigintMax(
            'amount',
            amount,
            maxAmount,
            `Entered ${getTokenDisplayName(token)} amount exceeds available to claim of ${formatEther(
              maxAmount,
            )}`,
          );
      });
    },
  );
};
