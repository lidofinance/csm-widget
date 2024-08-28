import { OneEther, TOKENS } from 'consts/tokens';
import { useStethByWsteth } from 'shared/hooks';

export const useExchangeRate = (token: TOKENS) => {
  const { data: rateWsteth, initialLoading: rateLoading } =
    useStethByWsteth(OneEther);

  return {
    rate: token === TOKENS.WSTETH ? rateWsteth : OneEther,
    loading: token === TOKENS.WSTETH ? rateLoading : false,
  };
};
