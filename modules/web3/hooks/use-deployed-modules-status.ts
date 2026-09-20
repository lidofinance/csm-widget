import { useQueries } from '@tanstack/react-query';
import { deployedModules, STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useLidoSDK } from '../web3-provider';
import { fetchSmStatus } from './use-sm-status';

/** Every deployed module's pause status, for screens with no active operator. */
export const useDeployedModulesStatus = () => {
  const { sm } = useLidoSDK();

  const results = useQueries({
    queries: deployedModules.map((module) => {
      const sdk = sm[module];
      return {
        queryKey: ['sm-status', { module }],
        ...STRATEGY_CONSTANT,
        queryFn: () => {
          invariant(sdk);
          return fetchSmStatus(sdk);
        },
        enabled: !!sdk,
      };
    }),
  });

  return {
    isPending: results.some((result) => result.isPending),
    allPaused: results.every(
      (result) =>
        result.data?.isPausedAccounting || result.data?.isPausedModule,
    ),
  };
};
