import { isHexadecimalString } from 'utils';
import { VALIDATION_MESSAGES } from './messages';
import { ValidationError } from './validation-error';

export const validateHex = (field: string, value?: string) => {
  if (!value) throw new ValidationError(field, '');

  const val = value.toLowerCase();

  const rest = val.slice(2);

  if (!val.startsWith('0x')) {
    throw new ValidationError(field, VALIDATION_MESSAGES.hexMustStartWith0x);
  }

  if (rest && !isHexadecimalString(rest))
    throw new ValidationError(field, VALIDATION_MESSAGES.hexNotHexadecimal);
};
