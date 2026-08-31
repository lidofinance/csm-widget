import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDKByModule } from '../web3-provider';

export const useDefaultCurveId = () => {
  const sdk = useSmSDKByModule(MODULE_NAME.CSM);

  return useQuery({
    queryKey: ['default-curve-id', { module: MODULE_NAME.CSM }],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(sdk);
      return sdk.permissionlessGate.getCurveId();
    },
    enabled: !!sdk,
  });
};
