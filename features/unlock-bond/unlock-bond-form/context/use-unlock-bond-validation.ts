import { formatEther } from '@ethersproject/units';
import { TOKENS } from 'consts/tokens';
import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import {
  handleResolverValidationError,
  validateBignumberMax,
  validateEtherAmount,
} from 'shared/hook-form/validation';
import { useAwaitNetworkData } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { getTokenDisplayName } from 'utils';
import type {
  UnlockBondFormInputType,
  UnlockBondFormNetworkData,
} from './types';

export const useUnlockBondValidation = (
  networkData: UnlockBondFormNetworkData,
) => {
  const dataPromise = useAwaitNetworkData(networkData);

  return useCallback<Resolver<UnlockBondFormInputType>>(
    async (values) => {
      try {
        const { amount } = values;

        const { lockedBond, etherBalance } = await dataPromise;

        if (amount?.gt(0)) {
          invariant(etherBalance);
          invariant(lockedBond);

          validateEtherAmount('amount', amount, TOKENS.ETH);

          validateBignumberMax(
            'amount',
            amount,
            etherBalance,
            `Entered ${getTokenDisplayName(TOKENS.ETH)} amount exceeds your balance of ${formatEther(
              etherBalance,
            )}`, // TODO: text
          );

          validateBignumberMax(
            'amount',
            amount,
            lockedBond,
            `Entered ${getTokenDisplayName(TOKENS.ETH)} amount exceeds locked bond of ${formatEther(
              lockedBond,
            )}`, // TODO: text
          );
        }

        return {
          values,
          errors: {},
        };
      } catch (error) {
        return handleResolverValidationError(error, 'UnlockBondForm', 'amount');
      }
    },
    [dataPromise],
  );
};
