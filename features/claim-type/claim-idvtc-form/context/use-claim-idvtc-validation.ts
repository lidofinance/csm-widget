import {
  useFormValidation,
  ValidationError,
  VALIDATION_MESSAGES,
} from 'shared/hook-form/validation';
import type {
  ClaimIdvtcFormInputType,
  ClaimIdvtcFormNetworkData,
} from './types';

export const useClaimIdvtcValidation = () => {
  return useFormValidation<ClaimIdvtcFormInputType, ClaimIdvtcFormNetworkData>(
    'curveId',
    async (_, { canClaimCurve, proof, idvtcPaused }, validate) => {
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
        if (idvtcPaused) {
          throw new ValidationError('curveId', VALIDATION_MESSAGES.idvtcPaused);
        }
        if (!canClaimCurve) {
          throw new ValidationError(
            'curveId',
            VALIDATION_MESSAGES.onlyOwnerCanClaimType,
          );
        }
      });
    },
  );
};
