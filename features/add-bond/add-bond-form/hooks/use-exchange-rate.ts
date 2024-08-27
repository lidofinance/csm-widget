import { ONE_ETH, TOKENS } from 'consts/tokens';
import { useStethByWsteth } from 'shared/hooks';

export const useExchangeRate = (token: TOKENS) => {
  const { data: rateWsteth, initialLoading: rateLoading } =
    useStethByWsteth(ONE_ETH);

  return {
    rate: token === TOKENS.WSTETH ? rateWsteth : ONE_ETH,
    loading: token === TOKENS.WSTETH ? rateLoading : false,
  };
};
