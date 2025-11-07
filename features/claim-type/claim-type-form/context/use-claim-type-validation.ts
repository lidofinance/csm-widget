import {
  useFormValidation,
  ValidationError,
} from 'shared/hook-form/validation';
import type { ClaimTypeFormInputType, ClaimTypeFormNetworkData } from './types';

export const useClaimTypeValidation = () => {
  return useFormValidation<ClaimTypeFormInputType, ClaimTypeFormNetworkData>(
    'curveId',
    async (_, { canClaimCurve, proof, icsPaused }, validate) => {
      await validate('curveId', () => {
        if (!proof.proof) {
          throw new ValidationError('curveId', 'proof is not provided');
        }
      });

      await validate('curveId', () => {
        if (proof.isConsumed) {
          throw new ValidationError(
            'curveId',
            'claim has already been consumed',
          );
        }
      });

      await validate('curveId', () => {
        if (!canClaimCurve) {
          throw new ValidationError('curveId', 'only owner can claim type');
        }
        if (icsPaused) {
          throw new ValidationError('curveId', 'ICS is paused');
        }
      });
    },
  );
};
