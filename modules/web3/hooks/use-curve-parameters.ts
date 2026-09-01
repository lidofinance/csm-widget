import { CurveParameters, MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import invariant from 'tiny-invariant';
import { useTargetSmSDK } from '../web3-provider';

export const useCurveParameters = <TData = CurveParameters>(
  curveId: bigint | undefined,
  select?: (data: CurveParameters) => TData,
  module?: MODULE_NAME,
) => {
  const { targetModule, sdk } = useTargetSmSDK(module);

  return useQuery({
    queryKey: ['curve-parameters', { curveId, module: targetModule }],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(curveId !== undefined && sdk);
      return sdk.parameters.getAll(curveId);
    },
    enabled: curveId !== undefined && !!sdk,
    select,
  });
};
