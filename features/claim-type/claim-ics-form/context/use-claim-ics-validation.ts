import {
  useFormValidation,
  ValidationError,
} from 'shared/hook-form/validation';
import type { ClaimIcsFormInputType, ClaimIcsFormNetworkData } from './types';

export const useClaimIcsValidation = () => {
  return useFormValidation<ClaimIcsFormInputType, ClaimIcsFormNetworkData>(
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
