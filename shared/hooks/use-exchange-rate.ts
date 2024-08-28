import { ONE_ETH, TOKENS } from 'consts/tokens';
import { useMemo } from 'react';
import { useMergeSwr, useStethByWsteth } from 'shared/hooks';

// TODO: drop this one
export const useExchangeRate = (token: TOKENS) => {
  const { data: rateWsteth, initialLoading: rateLoading } =
    useStethByWsteth(ONE_ETH);

  return {
    rate: token === TOKENS.WSTETH ? rateWsteth : ONE_ETH,
    loading: token === TOKENS.WSTETH ? rateLoading : false,
  };
};

export const useExchangeTokensRate = () => {
  const swrWstRate = useStethByWsteth(ONE_ETH);

  return useMergeSwr(
    [swrWstRate],
    useMemo(
      () => ({
        [TOKENS.ETH]: ONE_ETH,
        [TOKENS.STETH]: ONE_ETH,
        [TOKENS.WSTETH]: swrWstRate.data,
      }),
      [swrWstRate.data],
    ),
  );
};
