import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { useCSEarlyAdoptionRPC } from 'shared/hooks';

export const useCsmCurveIdEarlyAdoption = (config = STRATEGY_CONSTANT) => {
  return useContractSWR({
    contract: useCSEarlyAdoptionRPC(),
    method: 'CURVE_ID',
    params: [],
    config,
  });
};
