import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import { useLidoSDK } from '../web3-provider';

export const useCsmStatus = () => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['csm-status'],
    ...STRATEGY_CONSTANT,
    queryFn: () => csm.common.getStatus(),
  });
};
