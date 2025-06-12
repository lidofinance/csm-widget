import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import {
  handleResolverValidationError,
  ValidationError,
} from 'shared/hook-form/validation';
import { useAwaitNetworkData } from 'shared/hooks';
import invariant from 'tiny-invariant';
import type { ClaimTypeFormInputType, ClaimTypeFormNetworkData } from './types';

export const useClaimTypeValidation = (
  networkData: ClaimTypeFormNetworkData,
) => {
  const dataPromise = useAwaitNetworkData(networkData);

  return useCallback<Resolver<ClaimTypeFormInputType>>(
    async (values) => {
      try {
        const { address, canClaimCurve, proof } = await dataPromise;

        invariant(address);
        invariant(proof);

        if (!proof.proof)
          throw new ValidationError('curveId', 'proof is not provided');

        if (proof.isConsumed)
          throw new ValidationError(
            'curveId',
            'claim has already been consumed',
          );

        // TODO: or ICS is paused
        if (!canClaimCurve)
          throw new ValidationError('curveId', 'only owner can claim type');

        return {
          values,
          errors: {},
        };
      } catch (error) {
        return handleResolverValidationError(error, 'ClaimTypeForm', 'curveId');
      }
    },
    [dataPromise],
  );
};
