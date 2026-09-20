import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useLidoSDK, useTargetSmSDK } from '../web3-provider';

export const useSmStatus = (module?: MODULE_NAME) => {
  const { targetModule, sdk } = useTargetSmSDK(module);

  return useQuery({
    queryKey: ['sm-status', { module: targetModule }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(sdk);
      const [status, registration] = await Promise.all([
        sdk.module.getStatus(),
        sdk.module.getRegistration(),
      ]);
      return { ...status, ...registration };
    },
    enabled: !!sdk,
    select: (data) => ({
      ...data,
      isPaused: data.isPausedAccounting || data.isPausedModule,
    }),
  });
};

/** No module → supported only if every deployed module is. */
export const useSmVersionSupported = (module?: MODULE_NAME) => {
  const { sm } = useLidoSDK();
  const target = module ? [sm[module]] : Object.values(sm);

  return useQuery({
    queryKey: [
      'sm-version',
      { modules: target.map((s) => s?.core.moduleName) },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      const results = await Promise.all(
        target.map((s) => {
          invariant(s);
          return s.module.isVersionsSupported();
        }),
      );
      return results.every(Boolean);
    },
  });
};
