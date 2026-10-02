import { useQueries } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useLidoSDK } from '../web3-provider';
import { fetchSmStatus } from './use-sm-status';

/** Every deployed module's pause status, for screens with no active operator. */
export const useDeployedModulesStatus = () => {
  const { sm } = useLidoSDK();

  const results = useQueries({
    queries: [...sm.modules].map(([module, sdk]) => ({
      queryKey: ['sm-status', { module }],
      ...STRATEGY_CONSTANT,
      queryFn: () => fetchSmStatus(sdk),
    })),
  });

  return {
    isPending: results.some((result) => result.isPending),
    allPaused: results.every(
      (result) =>
        result.data?.isPausedAccounting || result.data?.isPausedModule,
    ),
  };
};
