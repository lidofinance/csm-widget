import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import { useLidoSDK } from '../web3-provider';

export const useOperatorsWithLockedBond = () => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['operators-with-locked-bond'],
    ...STRATEGY_CONSTANT,
    queryFn: () => csm.stealing.getOperatorsWithLockedBond(),
  });
};
