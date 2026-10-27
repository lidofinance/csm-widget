import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useExternalLinks } from 'shared/hooks';
import { standardFetcher } from 'utils';

type SmaAprResponse = { data?: { smaApr?: unknown } };

/** stETH 7-day SMA APR in percent. */
export const useStethSmaApr = () => {
  const { ethApi } = useExternalLinks();

  return useQuery({
    queryKey: ['steth-sma-apr', { ethApi }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      const { data } = await standardFetcher<SmaAprResponse>(
        `${ethApi}/v1/protocol/steth/apr/sma`,
      );
      const apr = data?.smaApr;
      if (typeof apr !== 'number' || !Number.isFinite(apr)) {
        throw new Error('Invalid stETH SMA APR response');
      }
      return apr;
    },
  });
};
