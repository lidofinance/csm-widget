import {
  useFormValidation,
  ValidationError,
} from 'shared/hook-form/validation';
import { compareLowercase } from 'utils';
import { isAddress } from 'viem';
import type {
  ChangeRoleFormInputType,
  ChangeRoleFormNetworkData,
} from './types';

export const useChangeRoleValidation = () => {
  return useFormValidation<ChangeRoleFormInputType, ChangeRoleFormNetworkData>(
    'address',
    async (
      { address, isRevoke },
      { currentAddress, proposedAddress, isPropose },
      validate,
    ) => {
      await validate('address', () => {
        if (!isRevoke && !isAddress(address ?? '')) {
          throw new ValidationError('address', 'Specify a valid address');
        }
      });

      await validate('address', () => {
        if (
          !isRevoke &&
          isPropose &&
          compareLowercase(address, currentAddress)
        ) {
          throw new ValidationError(
            'address',
            'Should not be same as current address',
          );
        }
      });

      await validate('address', () => {
        if (
          !isRevoke &&
          isPropose &&
          compareLowercase(address, proposedAddress)
        ) {
          throw new ValidationError(
            'address',
            'Should not be same as proposed address',
          );
        }
      });
    },
  );
};
