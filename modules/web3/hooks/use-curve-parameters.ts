import { CurveParameters, CurveRef } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDKByModule } from '../web3-provider';

export const useCurveParameters = <TData = CurveParameters>(
  curve: CurveRef | undefined,
  select?: (data: CurveParameters) => TData,
) => {
  const sdk = useSmSDKByModule(curve?.module);

  return useQuery({
    queryKey: [
      'curve-parameters',
      curve && { curveId: curve.curveId, module: curve.module },
    ],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(curve && sdk);
      return sdk.parameters.getAll(curve.curveId);
    },
    enabled: !!curve && !!sdk,
    select,
  });
};
