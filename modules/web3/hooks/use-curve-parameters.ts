import { ParametersSDK } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import invariant from 'tiny-invariant';
import { useLidoSDK } from '../web3-provider';

type Result = Awaited<ReturnType<InstanceType<typeof ParametersSDK>['getAll']>>;

export const useCurveParameters = <TData = Result>(
  curveId?: bigint,
  select?: (data: Result) => TData,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['curve-parameters', { curveId }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(curveId !== undefined);
      return csm.parameters.getAll(curveId);
    },
    enabled: curveId !== undefined,
    select,
  });
};
