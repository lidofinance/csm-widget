import { TOKENS } from '@lidofinance/lido-csm-sdk/common';
import { useQuery } from '@tanstack/react-query';
import { ONE_ETH } from 'consts';
import { STRATEGY_IMMUTABLE } from 'consts/react-query-strategies';
import { useStETHByWstETH } from 'modules/web3';

// FIXME: drop this one
export const useExchangeRate = (token: TOKENS) => {
  const { data: rateWsteth, isPending: rateLoading } =
    useStETHByWstETH(ONE_ETH);

  return {
    rate: token === TOKENS.wsteth ? rateWsteth : ONE_ETH,
    loading: token === TOKENS.wsteth ? rateLoading : false,
  };
};

export const useExchangeTokensRate = () => {
  const swrWstRate = useStETHByWstETH(ONE_ETH);

  return useQuery({
    queryKey: ['use-exchange-tokens-rate'],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => ({
      [TOKENS.eth]: ONE_ETH,
      [TOKENS.steth]: ONE_ETH,
      [TOKENS.wsteth]: swrWstRate.data,
    }),
    enabled: !!swrWstRate.data,
  });
};
