import { useContractSWR, useWSTETHContractRPC } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { BigNumber } from 'ethers';

export const useWstethBySteth = (steth: BigNumber | undefined) => {
  return useContractSWR({
    contract: useWSTETHContractRPC(),
    method: 'getWstETHByStETH',
    params: [steth],
    shouldFetch: !!steth,
    config: STRATEGY_LAZY,
  });
};
