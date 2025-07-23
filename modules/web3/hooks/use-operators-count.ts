import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useLidoSDK } from '../web3-provider';

export const useOperatorsCount = () => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['node-operators-count'],
    ...STRATEGY_CONSTANT,
    queryFn: () => csm.module.getOperatorsCount(),
  });
};
