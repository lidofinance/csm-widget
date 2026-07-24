import {
  useFormValidation,
  ValidationError,
  VALIDATION_MESSAGES,
} from 'shared/hook-form/validation';
import type { ClaimIcsFormInputType, ClaimIcsFormNetworkData } from './types';

export const useClaimIcsValidation = () => {
  return useFormValidation<ClaimIcsFormInputType, ClaimIcsFormNetworkData>(
    'curveId',
    async (_, { canClaimCurve, proof, icsPaused }, validate) => {
      await validate('curveId', () => {
        if (!proof.proof) {
          throw new ValidationError(
            'curveId',
            VALIDATION_MESSAGES.proofNotProvided,
          );
        }
      });

      await validate('curveId', () => {
        if (proof.isConsumed) {
          throw new ValidationError(
            'curveId',
            VALIDATION_MESSAGES.claimAlreadyConsumed,
          );
        }
      });

      await validate('curveId', () => {
        if (!canClaimCurve) {
          throw new ValidationError(
            'curveId',
            VALIDATION_MESSAGES.onlyOwnerCanClaimType,
          );
        }
        if (icsPaused) {
          throw new ValidationError('curveId', VALIDATION_MESSAGES.icsPaused);
        }
      });
    },
  );
};
