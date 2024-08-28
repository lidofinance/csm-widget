import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { validateBignumberMax } from './validate-bignumber-max';
import { getTokenDisplayName } from 'utils';
import { formatEther } from '@ethersproject/units';

export const validateMaxAmount = (
  fieldName: string,
  amount: BigNumber,
  token: TOKENS,
  max: Record<TOKENS, BigNumber>,
) => {
  const maxAmount = max[token];

  validateBignumberMax(
    fieldName,
    amount,
    max.ETH,
    `Entered ${getTokenDisplayName(token)} ${fieldName} exceeds available to claim of ${formatEther(
      maxAmount,
    )}`, // TODO: text
  );
};
