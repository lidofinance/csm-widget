import type { BigNumber } from 'ethers';
import { ValidationError } from './validation-error';

export const validateBignumberMax = (
  field: string,
  value: BigNumber,
  max: BigNumber,
  message: string,
) => {
  if (value.gt(max)) throw new ValidationError(field, message);
};
