import {
  useFormValidation,
  validateBigintMax,
  validateEtherAmount,
} from 'shared/hook-form/validation';
import { calculateAvailableToClaim, getTokenDisplayName } from 'utils';
import { formatEther } from 'viem';
import { getMaxValues } from './get-max-values';
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
      { bond, rewards, poolData, feeSplits },
      validate,
    ) => {
      if (claimOption === CLAIM_OPTION.REWARDS_TO_BOND) return;

      const includesRewards = claimOption !== CLAIM_OPTION.BOND_TO_RA;
      // Mirror flow.showAmount: skip amount validation when nothing is
      // receivable on the Rewards Address (e.g. splitters take 100% with no
      // excess bond, or rewards fully cover an insufficient bond).
      const maxAvailableSteth = calculateAvailableToClaim({
        bond,
        rewards: includesRewards ? rewards : undefined,
        feeSplits,
      });
      if (maxAvailableSteth === 0n) return;

      await validate('amount', () => {
        validateEtherAmount(
          'amount',
          amount,
          token,
          Boolean(includesRewards && rewards?.available),
        );

        const index = claimOption === CLAIM_OPTION.BOND_TO_RA ? 0 : 1;
        const maxAmount = getMaxValues({
          bond,
          rewards,
          poolData,
          feeSplits,
        })?.[token][index];
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
