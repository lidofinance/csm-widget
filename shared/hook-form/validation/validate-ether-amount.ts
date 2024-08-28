import { MaxUint256, Zero } from '@ethersproject/constants';
import { TOKENS } from 'consts/tokens';
import type { BigNumber } from 'ethers';
import { getTokenDisplayName } from 'utils/getTokenDisplayName';
import { ValidationError } from './validation-error';

export const validateEtherAmount = (
  field: string,
  amount: BigNumber | undefined,
  token: TOKENS,
) => {
  if (!amount) throw new ValidationError(field, '');

  if (amount.lte(Zero))
    throw new ValidationError(
      field,
      `Enter ${getTokenDisplayName(token)} ${field} greater than 0`,
    );

  if (amount.gt(MaxUint256))
    throw new ValidationError(
      field,
      `${getTokenDisplayName(token)} ${field} is not valid`,
    );
};
