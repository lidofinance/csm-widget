import type { BigNumber } from 'ethers';
import { ValidationError } from './validation-error';

export const validateNodeOperatorId = (
  field: string,
  value?: string,
  max?: BigNumber,
) => {
  if (!value) throw new ValidationError(field, 'Is required');

  const val = Number.parseInt(value);

  if (Number.isNaN(val) || val < 0)
    throw new ValidationError(field, 'Invalid ID');

  if (max?.lte(val))
    throw new ValidationError(
      field,
      `Max Node Operator ID is ${max.toNumber() - 1}`,
    );
};
