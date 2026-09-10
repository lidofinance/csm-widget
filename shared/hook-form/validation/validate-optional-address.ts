import { isAddress } from 'viem';
import { ValidationError } from './validation-error';

/** Empty means "not specified" and passes; anything non-empty must be a valid address. */
export const validateOptionalAddress = (
  field: string,
  value: string | undefined,
  message: string,
) => {
  if (value && !isAddress(value)) {
    throw new ValidationError(field, message);
  }
};
