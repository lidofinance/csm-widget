import {
  useFormValidation,
  ValidationError,
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
          throw new ValidationError('address', 'Specify a valid address');
        }
      });

      await validate('address', () => {
        if (compareLowercase(address, currentClaimerAddress)) {
          throw new ValidationError(
            'address',
            'Should not be same as current claimer',
          );
        }
      });
    },
  );
};
