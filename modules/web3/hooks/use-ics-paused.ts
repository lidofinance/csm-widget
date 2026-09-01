import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDKByModule } from '../web3-provider';

export const useIcsPaused = () => {
  const sdk = useSmSDKByModule(MODULE_NAME.CSM);

  return useQuery({
    queryKey: ['ics-paused', { module: MODULE_NAME.CSM }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk);
      return sdk.icsGate.isPaused();
    },
    enabled: !!sdk,
  });
};
