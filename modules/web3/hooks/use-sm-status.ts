import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useSmSDK } from '../web3-provider';

export const useSmStatus = () => {
  const { module, core } = useSmSDK();

  return useQuery({
    queryKey: ['sm-status', { module: core.moduleName }],
    ...STRATEGY_CONSTANT,
    queryFn: () => module.getStatus(),
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
