import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useLidoSDK } from '../web3-provider';

export const useCsmStatus = () => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['csm-status'],
    ...STRATEGY_CONSTANT,
    queryFn: () => csm.module.getStatus(),
    select: (data) => ({
      ...data,
      isPaused: data.isPausedAccounting || data.isPausedModule,
    }),
  });
};

export const useCsmVersionSupported = () => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['csm-version'],
    ...STRATEGY_CONSTANT,
    queryFn: async () => csm.module.isVersionsSupported(),
  });
};
