import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { ValidationError } from './validation-error';

export const validateNodeOperatorId = (
  field: string,
  value?: string,
  max?: NodeOperatorId,
) => {
  if (!value) throw new ValidationError(field, '');

  try {
    const val = BigInt(value);
    if (val < 0) {
      throw new ValidationError(field, 'Invalid ID');
    }

    if (max !== undefined && max <= val)
      throw new ValidationError(field, `Max Node Operator ID is ${max - 1n}`);
  } catch (e) {
    if (e instanceof ValidationError) return e;
    throw new ValidationError(field, 'Invalid ID');
  }
};
