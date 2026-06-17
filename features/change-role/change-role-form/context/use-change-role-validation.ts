import { ROLES } from '@lidofinance/lido-csm-sdk';
import {
  useFormValidation,
  ValidationError,
} from 'shared/hook-form/validation';
import { VALIDATION_MESSAGES } from 'shared/hook-form/validation/messages';
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
      { address, intent },
      { currentAddress, proposedAddress },
      validate,
    ) => {
      const isSubmit = intent === 'submit';

      await validate('address', () => {
        if (isSubmit && !isAddress(address ?? '')) {
          throw new ValidationError(
            'address',
            VALIDATION_MESSAGES.specifyValidAddress,
          );
        }
      });

      await validate('address', () => {
        if (
          isSubmit &&
          (mode === 'propose' || mode === 'rewardsChange') &&
          compareLowercase(address, currentAddress)
        ) {
          throw new ValidationError(
            'address',
            VALIDATION_MESSAGES.notSameAsCurrentAddress,
          );
        }
      });

      await validate('address', () => {
        if (
          isSubmit &&
          mode === 'propose' &&
          compareLowercase(address, proposedAddress)
        ) {
          throw new ValidationError(
            'address',
            VALIDATION_MESSAGES.notSameAsProposedAddress,
          );
        }
      });
    },
  );
};
