import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import { useLidoSDK } from '../web3-provider';

export const useDefaultCurveId = () => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['default-curve-id'],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => csm.permissionlessGate.getCurveId(),
  });
};
