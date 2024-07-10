import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { useStethByWsteth } from 'shared/hooks';

export const useStethAmount = (token: TOKENS, amount?: BigNumber) => {
  const { data: wstethToSteth } = useStethByWsteth(
    (token === TOKENS.WSTETH && amount) || undefined,
  );

  return token === TOKENS.WSTETH ? wstethToSteth : amount;
};
