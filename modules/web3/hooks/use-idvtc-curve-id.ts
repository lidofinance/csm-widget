import { CurveRef, MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDKByModule } from '../web3-provider';

export const useIdvtcCurveId = () => {
  const sdk = useSmSDKByModule(MODULE_NAME.CSM);

  return useQuery({
    queryKey: ['idvtc-curve-id', { module: MODULE_NAME.CSM }],
    ...STRATEGY_IMMUTABLE,
    queryFn: async () => {
      invariant(sdk);
      const curveId = await sdk.idvtcGate.getCurveId();
      const ref: CurveRef<MODULE_NAME.CSM> = {
        curveId,
        module: MODULE_NAME.CSM,
      };
      return ref;
    },
    enabled: !!sdk,
  });
};
