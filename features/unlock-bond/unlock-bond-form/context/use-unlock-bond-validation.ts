import { TOKENS } from '@lidofinance/lido-csm-sdk';
import {
  useFormValidation,
  validateBigintMax,
  validateEtherAmount,
} from 'shared/hook-form/validation';
import { getTokenDisplayName } from 'utils';
import { formatEther } from 'viem';
import type {
  UnlockBondFormInputType,
  UnlockBondFormNetworkData,
} from './types';

export const useUnlockBondValidation = () => {
  return useFormValidation<UnlockBondFormInputType, UnlockBondFormNetworkData>(
    'amount',
    async ({ amount }, { lockedBond, ethBalance }, validate) => {
      await validate('amount', () =>
        validateEtherAmount('amount', amount, TOKENS.eth),
      );

      await validate('amount', () =>
        validateBigintMax(
          'amount',
          amount ?? 0n,
          ethBalance,
          `Entered ${getTokenDisplayName(TOKENS.eth)} amount exceeds your balance of ${formatEther(
            ethBalance,
          )}`,
        ),
      );

      await validate('amount', () =>
        validateBigintMax(
          'amount',
          amount ?? 0n,
          lockedBond,
          `Entered ${getTokenDisplayName(TOKENS.eth)} amount exceeds locked bond of ${formatEther(
            lockedBond,
          )}`,
        ),
      );
    },
  );
};
