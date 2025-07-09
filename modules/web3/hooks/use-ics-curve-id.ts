import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import { useLidoSDK } from '../web3-provider';

export const useIcsCurveId = () => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['ics-curve-id'],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => csm.icsGate.getCurveId(),
  });
};
