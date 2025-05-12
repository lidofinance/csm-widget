import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import {
  handleResolverValidationError,
  ValidationError,
} from 'shared/hook-form/validation';
import { useAwaitNetworkData } from 'shared/hooks';
import { compareLowercase } from 'utils';
import type {
  ChangeRoleFormInputType,
  ChangeRoleFormNetworkData,
} from './types';
import { isAddress } from 'viem';

export const useChangeRoleValidation = (
  networkData: ChangeRoleFormNetworkData,
) => {
  const dataPromise = useAwaitNetworkData(networkData);

  return useCallback<Resolver<ChangeRoleFormInputType>>(
    async (values) => {
      try {
        const { address, isRevoke } = values;

        const { currentAddress, proposedAddress, isPropose } =
          await dataPromise;

        if (!isRevoke && !isAddress(address ?? '')) {
          throw new ValidationError('address', 'Specify a valid address');
        }

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

        return {
          values,
          errors: {},
        };
      } catch (error) {
        return handleResolverValidationError(
          error,
          'ChangeRoleForm',
          'address',
        );
      }
    },
    [dataPromise],
  );
};
