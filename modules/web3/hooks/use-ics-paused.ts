import { useQuery } from '@tanstack/react-query';
import { MODULE, STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const useIcsPaused = () => {
  const sdk = useSmSDK(MODULE.CSM);

  return useQuery({
    queryKey: ['ics-paused'],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk);
      return sdk.icsGate.isPaused();
    },
    enabled: !!sdk,
  });
};
