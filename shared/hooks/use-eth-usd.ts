import { BigNumber } from 'ethers';
import { useMemo } from 'react';

import { useEthPriceFallback } from './use-eth-price-fallback';
import { weiToEth } from 'utils/weiToEth';
import { getConfig } from 'config';
import { CHAINS } from 'consts/chains';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useEthPrice } from '@lido-sdk/react';

const { defaultChain } = getConfig();
const isMainnet = defaultChain === CHAINS.Mainnet;

// TODO: remove fallback after deploy csm.lido.fi
export const useEthUsd = (amount?: BigNumber) => {
  const mainnetPriceSwr = useEthPrice(STRATEGY_LAZY);
  const testnetPriceSwr = useEthPriceFallback();

  const { data: price, ...swr } = isMainnet ? mainnetPriceSwr : testnetPriceSwr;

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
