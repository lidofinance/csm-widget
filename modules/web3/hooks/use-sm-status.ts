import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK, useTargetSmSDK } from '../web3-provider';

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

export const useSmVersionSupported = () => {
  const { module, core } = useSmSDK();

  return useQuery({
    queryKey: ['sm-version', { module: core.moduleName }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => module.isVersionsSupported(),
  });
};
