import { BigNumber } from 'ethers';
import { useMemo } from 'react';

import { useEthPrice } from '@lido-sdk/react';
import { getConfig } from 'config';
import { CHAINS } from 'consts/chains';
import { STRATEGY_CONSTANT, STRATEGY_IMMUTABLE } from 'consts/swr-strategies';
import { weiToEth } from 'utils/weiToEth';
import { useEthPriceFallback } from './use-eth-price-fallback';

const { defaultChain } = getConfig();
const isMainnet = defaultChain === CHAINS.Mainnet;

// TODO: use eth-api.lido.fi
export const useEthUsd = (amount?: BigNumber) => {
  const mainnetPriceSwr = useEthPrice(STRATEGY_CONSTANT);
  const testnetPriceSwr = useEthPriceFallback(STRATEGY_IMMUTABLE);

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
