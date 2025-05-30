import { formatEther } from '@ethersproject/units';
import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import {
  handleResolverValidationError,
  validateBigintMax,
  validateEtherAmount,
} from 'shared/hook-form/validation';
import { useAwaitNetworkData } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { getTokenDisplayName } from 'utils';
import type {
  UnlockBondFormInputType,
  UnlockBondFormNetworkData,
} from './types';
import { TOKENS } from '@lidofinance/lido-csm-sdk/common';

export const useUnlockBondValidation = (
  networkData: UnlockBondFormNetworkData,
) => {
  const dataPromise = useAwaitNetworkData(networkData);

  return useCallback<Resolver<UnlockBondFormInputType>>(
    async (values) => {
      try {
        const { amount } = values;

        const { lockedBond, ethBalance } = await dataPromise;

        invariant(ethBalance);
        invariant(lockedBond);

        validateEtherAmount('amount', amount, TOKENS.eth);

        validateBigintMax(
          'amount',
          amount ?? 0n,
          ethBalance,
          `Entered ${getTokenDisplayName(TOKENS.eth)} amount exceeds your balance of ${formatEther(
            ethBalance,
          )}`,
        );

        validateBigintMax(
          'amount',
          amount ?? 0n,
          lockedBond,
          `Entered ${getTokenDisplayName(TOKENS.eth)} amount exceeds locked bond of ${formatEther(
            lockedBond,
          )}`,
        );

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
