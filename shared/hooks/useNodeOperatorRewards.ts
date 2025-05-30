import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { BigNumber } from 'ethers';
import { useSTETHContractRPC } from 'shared/hooks';

export const useSharesToSteth = (
  shares?: BigNumber,
  config = STRATEGY_LAZY,
) => {
  return useContractSWR({
    contract: useSTETHContractRPC(),
    method: 'getPooledEthByShares',
    params: [shares],
    shouldFetch: !!shares && shares.gt(0),
    config,
  });
};
