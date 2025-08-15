import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useLidoSDK } from '../web3-provider';

export const useIcsPaused = () => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['ics-paused'],
    ...STRATEGY_CONSTANT,
    queryFn: () => csm.icsGate.isPaused(),
  });
};
