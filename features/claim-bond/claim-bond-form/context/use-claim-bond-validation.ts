import { formatEther } from '@ethersproject/units';
import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import {
  handleResolverValidationError,
  validateBignumberMax,
  validateEtherAmount,
} from 'shared/hook-form/validation';
import { useAwaitNetworkData } from 'shared/hooks';
import { getTokenDisplayName } from 'utils';
import type { ClaimBondFormInputType, ClaimBondFormNetworkData } from './types';

export const useClaimBondValidation = (
  networkData: ClaimBondFormNetworkData,
) => {
  const contextPromise = useAwaitNetworkData(networkData);
  return useCallback<Resolver<ClaimBondFormInputType>>(
    async (values, _, options) => {
      try {
        const { token, amount, claimRewards } = values;
        const { maxValues } = await contextPromise;

        if (options.names?.includes('amount') && amount?.gt(0)) {
          validateEtherAmount('amount', amount, token);

          const maxAmount = maxValues?.[token][Number(claimRewards)];
          if (amount && maxAmount)
            validateBignumberMax(
              'amount',
              amount,
              maxAmount,
              `Entered ${getTokenDisplayName(token)} amount exceeds available to claim of ${formatEther(
                maxAmount,
              )}`, // TODO: text
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
