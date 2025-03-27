import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { useStethAmount } from './use-steth-amount';
import { Zero } from '@ethersproject/constants';

export const useBondWillReceive = (
  token: TOKENS,
  amount?: BigNumber,
  rewards?: BigNumber,
) => {
  const stethAmount = useStethAmount(token, amount);

  return [
    (amount &&
      stethAmount &&
      rewards &&
      rewards.gt(stethAmount) &&
      rewards.sub(stethAmount)) ||
      Zero,
    !!(amount && stethAmount && rewards && stethAmount.gt(rewards)),
  ] as const;
};
