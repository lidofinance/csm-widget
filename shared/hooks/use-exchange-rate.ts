import { PerToken, TOKENS } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { ONE_ETH, STRATEGY_IMMUTABLE } from 'consts';
import { useStETHByWstETH } from 'modules/web3';
import invariant from 'tiny-invariant';

export const useExchangeRate = <TData = PerToken<bigint>>(
  select?: (data: PerToken<bigint>) => TData,
) => {
  const { data: rateWsteth } = useStETHByWstETH(ONE_ETH);

  return useQuery({
    queryKey: ['use-exchange-tokens-rate'],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(rateWsteth !== undefined);
      return {
        [TOKENS.eth]: ONE_ETH,
        [TOKENS.steth]: ONE_ETH,
        [TOKENS.wsteth]: rateWsteth,
      };
    },
    enabled: !!rateWsteth,
    select,
  });
};
