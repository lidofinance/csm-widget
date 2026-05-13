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
      {
        rewards,
        calculation: {
          claimableBond,
          claimableBondAndRewards,
          claimableMaxValues,
        },
      },
      validate,
    ) => {
      if (claimOption === CLAIM_OPTION.REWARDS_TO_BOND) return;

      const includesRewards = claimOption !== CLAIM_OPTION.BOND_TO_RA;
      // Mirror flow.showAmount: skip amount validation when nothing is
      // receivable on the Rewards Address (e.g. splitters take 100% with no
      // excess bond, or rewards fully cover an insufficient bond).
      const maxAvailableSteth = includesRewards
        ? claimableBondAndRewards
        : claimableBond;
      if (maxAvailableSteth === 0n) return;

      await validate('amount', () => {
        validateEtherAmount(
          'amount',
          amount,
          token,
          Boolean(includesRewards && rewards?.available),
        );

        const index = claimOption === CLAIM_OPTION.BOND_TO_RA ? 0 : 1;
        const maxAmount = claimableMaxValues?.[token][index];
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
