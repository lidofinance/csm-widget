import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import { useLidoSDK } from '../web3-provider';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk/common';

export const useOperatorCurveId = <TData = bigint>(
  id?: NodeOperatorId,
  select?: (data: bigint) => TData,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['node-operator-curve-id', { id }],
    ...STRATEGY_CONSTANT,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: () => csm.operator.getCurveId(id!),
    enabled: id !== undefined,
    select,
  });
};
