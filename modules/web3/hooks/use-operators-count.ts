import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useSmSDK } from '../web3-provider';

export const useOperatorsCount = () => {
  const { module } = useSmSDK();

  return useQuery({
    queryKey: ['operators-count'],
    ...STRATEGY_CONSTANT,
    queryFn: () => module.getOperatorsCount(),
  });
};
