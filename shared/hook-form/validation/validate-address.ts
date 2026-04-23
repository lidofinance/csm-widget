import { isAddress } from 'viem';
import { ValidationError } from './validation-error';

export const validateAddress = (field: string, value = '') => {
  if (!isAddress(value)) {
    throw new ValidationError(field, 'Specify valid Address');
  }
};
