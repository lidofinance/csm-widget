import { BigNumber } from 'ethers';
import { useMemo } from 'react';

import { useEthPriceFallback } from './use-eth-price-fallback';
import { weiToEth } from 'utils/weiToEth';
// import { STRATEGY_LAZY } from 'consts/swr-strategies';
// import { useEthPrice } from '@lido-sdk/react';

export const useEthUsd = (amount?: BigNumber) => {
  // const { data: price, ...swr } = useEthPrice(STRATEGY_LAZY);
  const { data: price, ...swr } = useEthPriceFallback();
  const usdAmount = useMemo(() => {
    if (price && amount) {
      const txCostInEth = weiToEth(amount);
      return txCostInEth * price;
    }
    return undefined;
  }, [amount, price]);
  return {
    usdAmount,
    price,
    get initialLoading() {
      return swr.initialLoading;
    },
    get error() {
      return swr.error;
    },
    get loading() {
      return swr.loading;
    },
    update() {
      return swr.update();
    },
  };
};
