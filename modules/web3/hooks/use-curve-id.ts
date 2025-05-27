import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import { useLidoSDK } from '../web3-provider';

export const useCurveId = () => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['permissionless:getCurveId'],
    ...STRATEGY_CONSTANT,
    queryFn: () => csm.permissionlessGate.getCurveId(),
  });
};
