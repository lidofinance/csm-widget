import {
  useFormValidation,
  ValidationError,
  VALIDATION_MESSAGES,
} from 'shared/hook-form/validation';
import { compareLowercase } from 'utils';
import { isAddress } from 'viem';
import type { ClaimerFormInputType, ClaimerFormNetworkData } from './types';

export const useClaimerValidation = () => {
  return useFormValidation<ClaimerFormInputType, ClaimerFormNetworkData>(
    'address',
    async ({ address, isUnset }, { currentClaimerAddress }, validate) => {
      if (isUnset) return;

      await validate('address', () => {
        if (!isAddress(address ?? '')) {
          throw new ValidationError(
            'address',
            VALIDATION_MESSAGES.specifyValidAddress,
          );
        }
      });

      await validate('address', () => {
        if (compareLowercase(address, currentClaimerAddress)) {
          throw new ValidationError(
            'address',
            VALIDATION_MESSAGES.notSameAsCurrentClaimer,
          );
        }
      });
    },
  );
};
