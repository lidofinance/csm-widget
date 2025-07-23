import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { ValidationError } from './validation-error';

export const validateNodeOperatorId = (
  field: string,
  value?: NodeOperatorId,
  max?: NodeOperatorId,
) => {
  if (value === undefined) throw new ValidationError(field, '');

  try {
    if (value < 0n) {
      throw new ValidationError(field, 'Invalid ID');
    }

    if (max !== undefined && max <= value)
      throw new ValidationError(field, `Max Node Operator ID is ${max - 1n}`);
  } catch (e) {
    if (e instanceof ValidationError) return e;
    throw new ValidationError(field, 'Invalid ID');
  }
};
