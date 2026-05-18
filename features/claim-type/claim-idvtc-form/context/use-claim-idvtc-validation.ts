import {
  useFormValidation,
  ValidationError,
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
        if (idvtcPaused) {
          throw new ValidationError('curveId', 'IDVTC is paused');
        }
        if (!canClaimCurve) {
          throw new ValidationError('curveId', 'only owner can claim type');
        }
      });
    },
  );
};
