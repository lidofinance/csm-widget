import { useContractSWR, useWSTETHContractRPC } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { BigNumber } from 'ethers';

export const useStethByWsteth = (wsteth: BigNumber | undefined) => {
  return useContractSWR({
    contract: useWSTETHContractRPC(),
    method: 'getStETHByWstETH',
    params: [wsteth],
    shouldFetch: !!wsteth,
    config: STRATEGY_LAZY,
  });
};
