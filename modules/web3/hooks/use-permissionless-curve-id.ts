import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import { useLidoSDK } from '../web3-provider';

export const usePermissionlessCurveId = () => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['permissionless-curve-id'],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => csm.permissionlessGate.getCurveId(),
  });
};
