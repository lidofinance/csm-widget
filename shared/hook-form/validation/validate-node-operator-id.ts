import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { VALIDATION_MESSAGES, validationMessage } from './messages';
import { ValidationError } from './validation-error';

export const validateNodeOperatorId = (
  field: string,
  value?: NodeOperatorId | '',
  max?: NodeOperatorId,
) => {
  if (value === undefined || value === '') throw new ValidationError(field, '');

  try {
    if (value < 0n) {
      throw new ValidationError(field, VALIDATION_MESSAGES.invalidId);
    }

    if (max !== undefined && max <= value)
      throw new ValidationError(
        field,
        validationMessage.maxNodeOperatorId(max - 1n),
      );
  } catch (e) {
    if (e instanceof ValidationError) return e;
    throw new ValidationError(field, VALIDATION_MESSAGES.invalidId);
  }
};
