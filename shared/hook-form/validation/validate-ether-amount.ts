import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { MIN_ETH_AMOUNT } from 'consts/tokens';
import { getTokenDisplayName } from 'utils';
import { maxUint256 } from 'viem';
import { validationMessage } from './messages';
import { ValidationError } from './validation-error';

export const validateEtherAmount = (
  field: string,
  amount: bigint | undefined,
  token: TOKENS,
  allowZero = false,
) => {
  if (amount === undefined) throw new ValidationError(field, '');

  const tokenName = getTokenDisplayName(token);

  if (allowZero) {
    if (amount < 0n)
      throw new ValidationError(
        field,
        validationMessage.enterAmount(tokenName, field),
      );
  } else {
    if (amount <= 0n)
      throw new ValidationError(
        field,
        validationMessage.enterAmountGreaterThanZero(tokenName, field),
      );
  }

  if (token === TOKENS.eth && amount < MIN_ETH_AMOUNT)
    throw new ValidationError(
      field,
      validationMessage.enterAmountGreaterThan100Wei(tokenName, field),
    );

  if (amount > maxUint256)
    throw new ValidationError(
      field,
      validationMessage.amountIsNotValid(tokenName, field),
    );
};
