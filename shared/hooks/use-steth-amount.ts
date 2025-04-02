import { Zero } from '@ethersproject/constants';
import { TOKENS } from 'consts/tokens';
import { useStethByWsteth } from 'shared/hooks';

export const useStethAmount = (token: TOKENS, amount = Zero) => {
  const { data: wstethToSteth } = useStethByWsteth(
    (token === TOKENS.WSTETH && amount) || undefined,
  );

  return token === TOKENS.WSTETH ? wstethToSteth : amount;
};
