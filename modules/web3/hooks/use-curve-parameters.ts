import { CurveParameters } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import invariant from 'tiny-invariant';
import { useLidoSDK } from '../web3-provider';

export const useCurveParameters = <TData = CurveParameters>(
  curveId: bigint | undefined,
  select?: (data: CurveParameters) => TData,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['curve-parameters', { curveId }],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(curveId !== undefined);
      return csm.parameters.getAll(curveId);
    },
    enabled: curveId !== undefined,
    select,
  });
};
