import { isAddress } from 'ethers/lib/utils.js';
import { Resolver } from 'react-hook-form';
import {
  ValidationError,
  handleResolverValidationError,
} from 'shared/hook-form/validation/validation-error';
import invariant from 'tiny-invariant';
import { compareLowercase } from 'utils';
import {
  ChangeRoleFormInputType,
  ChangeRoleFormValidationContext,
} from './types';

export const changeRoleFormValidationResolver: Resolver<
  ChangeRoleFormInputType,
  Promise<ChangeRoleFormValidationContext>
> = async (values, contextPromise) => {
  const { address, isRevoke } = values;
  try {
    invariant(contextPromise);

    if (!isRevoke && (!address || !isAddress(address)))
      throw new ValidationError('address', 'Not valid address');

    const { currentAddress, proposedAddress } = await contextPromise;

    if (!isRevoke && compareLowercase(address, currentAddress)) {
      throw new ValidationError(
        'address',
        'Should not be same as current address',
      );
    }

    if (!isRevoke && compareLowercase(address, proposedAddress)) {
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
    return handleResolverValidationError(error, 'ChangeRoleForm', 'address');
  }
};
