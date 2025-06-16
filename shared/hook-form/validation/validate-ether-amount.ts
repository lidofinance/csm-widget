import { MIN_ETH_AMOUNT } from 'consts/tokens';
import { getTokenDisplayName } from 'utils';
import { ValidationError } from './validation-error';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { maxUint256 } from 'viem';

export const validateEtherAmount = (
  field: string,
  amount: bigint | undefined,
  token: TOKENS,
  allowZero = false,
) => {
  if (!amount) throw new ValidationError(field, '');

  if (allowZero) {
    if (amount < 0n)
      throw new ValidationError(
        field,
        `Enter ${getTokenDisplayName(token)} ${field}`,
      );
  } else {
    if (amount <= 0n)
      throw new ValidationError(
        field,
        `Enter ${getTokenDisplayName(token)} ${field} greater than 0`,
      );
  }

  if (token === TOKENS.eth && amount < MIN_ETH_AMOUNT)
    throw new ValidationError(
      field,
      `Enter ${getTokenDisplayName(token)} ${field} greater than 100 wei`,
    );

  if (amount > maxUint256)
    throw new ValidationError(
      field,
      `${getTokenDisplayName(token)} ${field} is not valid`,
    );
};
