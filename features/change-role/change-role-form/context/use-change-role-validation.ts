import { ROLES } from '@lidofinance/lido-csm-sdk';
import {
  useFormValidation,
  ValidationError,
} from 'shared/hook-form/validation';
import { useChangeRoleMode } from 'shared/hooks';
import { compareLowercase } from 'utils';
import { isAddress } from 'viem';
import type {
  ChangeRoleFormInputType,
  ChangeRoleFormNetworkData,
} from './types';

export const useChangeRoleValidation = (role: ROLES) => {
  const mode = useChangeRoleMode(role);

  return useFormValidation<ChangeRoleFormInputType, ChangeRoleFormNetworkData>(
    'address',
    async (
      { address, isRevoke },
      { currentAddress, proposedAddress },
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
          (mode === 'propose' || mode === 'rewardsChange') &&
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
          mode === 'propose' &&
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
