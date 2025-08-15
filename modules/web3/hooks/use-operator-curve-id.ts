import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useLidoSDK } from '../web3-provider';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import invariant from 'tiny-invariant';

export const KEY_OPERATOR_CURVE_ID = ['operator-curve-id'];

export const useOperatorCurveId = <TData = bigint>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: bigint) => TData,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: [...KEY_OPERATOR_CURVE_ID, { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(nodeOperatorId !== undefined);
      return csm.operator.getCurveId(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
    select,
  });
};
