import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_IMMUTABLE } from 'consts/swr-strategies';
import { useCSAccountingRPC } from 'shared/hooks';

export const useCsmCurveIdDefault = (config = STRATEGY_IMMUTABLE) => {
  return useContractSWR({
    contract: useCSAccountingRPC(),
    method: 'DEFAULT_BOND_CURVE_ID',
    params: [],
    config,
  });
};
