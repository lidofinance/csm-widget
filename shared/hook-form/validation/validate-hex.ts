import { isHexadecimalString } from 'utils';
import { VALIDATION_MESSAGES } from './messages';
import { ValidationError } from './validation-error';

export const validateHex: (
  field: string,
  value?: string,
) => asserts value is string = (field, value) => {
  if (!value) throw new ValidationError(field, '');

  if (!value.startsWith('0x')) {
    throw new ValidationError(field, VALIDATION_MESSAGES.hexMustStartWith0x);
  }

  const rest = value.slice(2);
  if (rest && !isHexadecimalString(rest))
    throw new ValidationError(field, VALIDATION_MESSAGES.hexNotHexadecimal);
};
