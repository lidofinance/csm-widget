import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { BigNumber } from 'ethers';
import { useCSAccountingRPC } from './useCsmContracts';

export const useCurveInfo = (
  curveId?: BigNumber,
  config = STRATEGY_CONSTANT,
) => {
  return useContractSWR({
    contract: useCSAccountingRPC(),
    method: 'getCurveInfo',
    params: [curveId],
    shouldFetch: !!curveId,
    config,
  });
};
