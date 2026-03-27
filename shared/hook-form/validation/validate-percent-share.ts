import { PERCENT_BASIS } from '@lidofinance/lido-csm-sdk';
import { ValidationError } from './validation-error';

export const validatePercentShare = (
  field: string,
  value: bigint | undefined,
) => {
  if (!value || value <= 0n) {
    throw new ValidationError(field, 'Share must be greater than 0');
  }
  if (value > PERCENT_BASIS) {
    throw new ValidationError(field, 'Share must not exceed 100%');
  }
};
