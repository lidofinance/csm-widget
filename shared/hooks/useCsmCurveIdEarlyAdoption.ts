import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_IMMUTABLE } from 'consts/swr-strategies';
import { useCSEarlyAdoptionRPC } from 'shared/hooks';

export const useCsmCurveIdEarlyAdoption = (config = STRATEGY_IMMUTABLE) => {
  return useContractSWR({
    contract: useCSEarlyAdoptionRPC(),
    method: 'CURVE_ID',
    params: [],
    config,
  });
};
