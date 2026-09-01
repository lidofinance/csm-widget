import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import invariant from 'tiny-invariant';
import { CsmFamilySDK, useSmSDKByModule } from '../web3-provider';

export const useDefaultCurveId = (
  module: MODULE_NAME.CSM | MODULE_NAME.CSM_02 = MODULE_NAME.CSM,
) => {
  const sdk = useSmSDKByModule(module) as CsmFamilySDK | undefined;

  return useQuery({
    queryKey: ['default-curve-id', { module }],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(sdk);
      return sdk.permissionlessGate.getCurveId();
    },
    enabled: !!sdk,
  });
};
