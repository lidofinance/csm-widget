import { PERCENT_BASIS } from '@lidofinance/lido-csm-sdk';
import { VALIDATION_MESSAGES } from './messages';
import { ValidationError } from './validation-error';

export const validatePercentShare = (
  field: string,
  value: bigint | undefined,
) => {
  if (!value || value <= 0n) {
    throw new ValidationError(field, VALIDATION_MESSAGES.shareGreaterThanZero);
  }
  if (value > PERCENT_BASIS) {
    throw new ValidationError(field, VALIDATION_MESSAGES.shareNotExceed100);
  }
};
