import { isHexadecimalString } from 'utils';
import { ValidationError } from './validation-error';

const HASH_LENGTH = 66;

export const validateHash = (field: string, value?: string) => {
  if (!value) throw new ValidationError(field, 'Is required');

  const val = value.toLowerCase();

  const rest = val.slice(2);

  if (!val.startsWith('0x')) {
    throw new ValidationError(field, 'Should start with "0x"');
  }

  if (rest && !isHexadecimalString(rest))
    throw new ValidationError(field, 'Is not hexadecimal string');

  if (value.length !== HASH_LENGTH)
    throw new ValidationError(field, 'Wrong length');
};
