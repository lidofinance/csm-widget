import { validationMessage } from './messages';
import { ValidationError } from './validation-error';

const MIN_LENGTH = 0;
const MAX_LENGTH = 256;

export const validateLength = (
  field: string,
  value = '',
  minLength = MIN_LENGTH,
  maxLength = MAX_LENGTH,
) => {
  if (value.trim().length < minLength)
    throw new ValidationError(field, validationMessage.tooShort(minLength));

  if (value.length > maxLength)
    throw new ValidationError(field, validationMessage.tooLong(maxLength));
};
