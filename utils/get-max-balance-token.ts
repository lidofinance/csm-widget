import { Zero } from '@ethersproject/constants';
import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';

export const getMaxBalanceToken = ({
  etherBalance,
  stethBalance,
  wstethBalance,
}: {
  etherBalance?: BigNumber;
  stethBalance?: BigNumber;
  wstethBalance?: BigNumber;
}) => {
  const balances = [
    [TOKENS.ETH, etherBalance],
    [TOKENS.STETH, stethBalance],
    [TOKENS.WSTETH, wstethBalance],
  ] as const;
  const [token] = balances.reduce(
    (prev, cur) => ((prev[1] ?? Zero).gt(cur[1] ?? 0) ? prev : cur),
    [TOKENS.ETH, undefined],
  );
  return token;
};
