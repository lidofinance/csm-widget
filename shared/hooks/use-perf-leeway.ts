import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_IMMUTABLE } from 'consts/swr-strategies';
import { useCSFeeOracleRPC } from './useCsmContracts';

export const usePerfLeeway = (config = STRATEGY_IMMUTABLE) => {
  return useContractSWR({
    contract: useCSFeeOracleRPC(),
    method: 'avgPerfLeewayBP',
    params: [],
    config,
  });
};
