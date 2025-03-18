import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { BigNumber } from 'ethers';
import { useWSTETHContractRPC } from 'shared/hooks';

export const useStethByWsteth = (wsteth: BigNumber | undefined) => {
  return useContractSWR({
    contract: useWSTETHContractRPC(),
    method: 'getStETHByWstETH',
    params: [wsteth],
    shouldFetch: !!wsteth,
    config: STRATEGY_LAZY,
  });
};
