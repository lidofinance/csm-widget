import { isAddress } from 'viem';
import { VALIDATION_MESSAGES } from './messages';
import { ValidationError } from './validation-error';

export const validateAddress = (
  field: string,
  value = '',
  message: string = VALIDATION_MESSAGES.invalidAddress,
) => {
  if (!isAddress(value)) {
    throw new ValidationError(field, message);
  }
};
