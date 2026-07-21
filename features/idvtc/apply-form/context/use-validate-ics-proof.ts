import { useCallback } from 'react';
import { useCheckIcsProof } from 'features/idvtc/shared';
import {
  ValidationError,
  VALIDATION_MESSAGES,
} from 'shared/hook-form/validation';
import { Address } from 'viem';

export const useValidateIcsProof = () => {
  const checkIcsProof = useCheckIcsProof();

  return useCallback(
    async (address: Address, fieldPath: string) => {
      const approved = await checkIcsProof(address);

      if (!approved) {
        throw new ValidationError(
          fieldPath,
          VALIDATION_MESSAGES.addressNotIcsApproved,
        );
      }
    },
    [checkIcsProof],
  );
};
