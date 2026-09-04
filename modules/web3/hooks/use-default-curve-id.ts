import { CurveRef, MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import invariant from 'tiny-invariant';
import { CsmFamilySDK, useSmSDKByModule } from '../web3-provider';

type CsmFamilyModule = MODULE_NAME.CSM | MODULE_NAME.CSM_02;

export const useDefaultCurveId = (
  module: CsmFamilyModule = MODULE_NAME.CSM,
) => {
  const sdk = useSmSDKByModule(module) as CsmFamilySDK | undefined;

  return useQuery({
    queryKey: ['default-curve-id', { module }],
    ...STRATEGY_IMMUTABLE,
    queryFn: async () => {
      invariant(sdk);
      const curveId = await sdk.permissionlessGate.getCurveId();
      const ref: CurveRef<CsmFamilyModule> = { curveId, module };
      return ref;
    },
    enabled: !!sdk,
  });
};
