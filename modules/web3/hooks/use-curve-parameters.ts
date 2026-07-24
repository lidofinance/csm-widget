import { CurveParameters } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const useCurveParameters = <TData = CurveParameters>(
  curveId: bigint | undefined,
  select?: (data: CurveParameters) => TData,
) => {
  const { parameters } = useSmSDK();

  return useQuery({
    queryKey: ['curve-parameters', { curveId }],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(curveId !== undefined);
      return parameters.getAll(curveId);
    },
    enabled: curveId !== undefined,
    select,
  });
};
