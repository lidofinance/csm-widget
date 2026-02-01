import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useSmSDK } from '../web3-provider';

export const useSmStatus = () => {
  const { module } = useSmSDK();

  return useQuery({
    queryKey: ['csm-status'],
    ...STRATEGY_CONSTANT,
    queryFn: () => module.getStatus(),
    select: (data) => ({
      ...data,
      isPaused: data.isPausedAccounting || data.isPausedModule,
    }),
  });
};

export const useSmVersionSupported = () => {
  const { module } = useSmSDK();

  return useQuery({
    queryKey: ['csm-version'],
    ...STRATEGY_CONSTANT,
    queryFn: async () => module.isVersionsSupported(),
  });
};
