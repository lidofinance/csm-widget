import {
  useFormValidation,
  validateBigintMax,
  validateEtherAmount,
} from 'shared/hook-form/validation';
import { getTokenDisplayName } from 'utils';
import { formatEther } from 'viem';
import {
  CLAIM_OPTION,
  type ClaimBondFormInputType,
  type ClaimBondFormNetworkData,
} from './types';

export const useClaimBondValidation = () => {
  return useFormValidation<ClaimBondFormInputType, ClaimBondFormNetworkData>(
    'token',
    async (
      { token, amount, claimOption },
      { maxValues, rewards },
      validate,
    ) => {
      if (claimOption === CLAIM_OPTION.REWARDS_TO_BOND) return;

      await validate('amount', () => {
        const includesRewards = claimOption !== CLAIM_OPTION.BOND_TO_RA;
        validateEtherAmount(
          'amount',
          amount,
          token,
          Boolean(includesRewards && rewards?.available),
        );

        const index = claimOption === CLAIM_OPTION.BOND_TO_RA ? 0 : 1;
        const maxAmount = maxValues?.[token][index];
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
