import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK, useSmSDKByModule } from '../web3-provider';

export const useSmStatus = (module?: MODULE_NAME) => {
  const activeSdk = useSmSDK();
  const targetModule = module ?? activeSdk.core.moduleName;
  const byModuleSdk = useSmSDKByModule(targetModule);
  const sdk = module ? byModuleSdk : activeSdk;

  return useQuery({
    queryKey: ['sm-status', { module: targetModule }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk);
      return sdk.module.getStatus();
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
