import { useEthPrice } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { weiToEth } from 'utils/weiToEth';

export const useEthUsdConverter = () => {
  const { data: price, ...swr } = useEthPrice(STRATEGY_LAZY);

  const ethToUsd = useCallback(
    (amount?: BigNumber) => {
      return price && amount ? weiToEth(amount) * price : undefined;
    },
    [price],
  );

  return {
    ethToUsd,
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
