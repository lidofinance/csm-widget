import { useLidoSWR } from '@lido-sdk/react';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';

export const useEthPriceFallback = (config = STRATEGY_CONSTANT) => {
  return useLidoSWR(
    ['eth-price-fallback'],
    async () => {
      return 3476.04573613;
    },
    config,
  );
};
