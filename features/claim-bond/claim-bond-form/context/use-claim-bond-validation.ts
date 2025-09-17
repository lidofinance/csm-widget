import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import {
  handleResolverValidationError,
  validateBigintMax,
  validateEtherAmount,
} from 'shared/hook-form/validation';
import { useAwaitNetworkData } from 'shared/hooks';
import { getTokenDisplayName } from 'utils';
import type { ClaimBondFormInputType, ClaimBondFormNetworkData } from './types';
import { formatEther } from 'viem';

export const useClaimBondValidation = (
  networkData: ClaimBondFormNetworkData,
) => {
  const contextPromise = useAwaitNetworkData(networkData);
  return useCallback<Resolver<ClaimBondFormInputType>>(
    async (values, _, options) => {
      try {
        const { token, amount, claimRewards } = values;
        const { maxValues, rewards } = await contextPromise;

        if (options.names?.includes('amount')) {
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
        }

        return {
          values,
          errors: {},
        };
      } catch (error) {
        return handleResolverValidationError(error, 'ClaimBondForm', 'token');
      }
    },
    [contextPromise],
  );
};
