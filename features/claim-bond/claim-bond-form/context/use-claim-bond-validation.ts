import {
  useFormValidation,
  validateBigintMax,
  validateEtherAmount,
} from 'shared/hook-form/validation';
import { getTokenDisplayName } from 'utils';
import { formatEther } from 'viem';
import {
  optionIncludesRewards,
  optionMaxValueIndex,
  optionShowsTokenAmount,
} from './claim-options';
import type { ClaimBondFormInputType, ClaimBondFormNetworkData } from './types';

export const useClaimBondValidation = () => {
  return useFormValidation<ClaimBondFormInputType, ClaimBondFormNetworkData>(
    'token',
    async (
      { token, amount, claimOption },
      { maxValues, rewards },
      validate,
    ) => {
      if (!optionShowsTokenAmount(claimOption)) return;

      await validate('amount', () => {
        const includesRewards = optionIncludesRewards(claimOption);
        validateEtherAmount(
          'amount',
          amount,
          token,
          Boolean(includesRewards && rewards?.available),
        );

        const maxAmount = maxValues?.[token][optionMaxValueIndex(claimOption)];
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
