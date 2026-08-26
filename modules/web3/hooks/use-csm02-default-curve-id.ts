import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDKByModule } from '../web3-provider';

// There is never an active CSM_02 operator during /create, so unlike
// useDefaultCurveId this must bypass the active-module guard.
export const useCsm02DefaultCurveId = () => {
  const sdk = useSmSDKByModule(MODULE_NAME.CSM_02);

  return useQuery({
    queryKey: ['default-curve-id', { module: MODULE_NAME.CSM_02 }],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(sdk);
      return sdk.permissionlessGate.getCurveId();
    },
    enabled: !!sdk,
  });
};
