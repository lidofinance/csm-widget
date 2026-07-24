import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const KEY_OPERATOR_CURVE_ID = ['operator-curve-id'];

export const useOperatorCurveId = <TData = bigint>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: bigint) => TData,
) => {
  const { operator } = useSmSDK();

  return useQuery({
    queryKey: [...KEY_OPERATOR_CURVE_ID, { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(nodeOperatorId !== undefined);
      return operator.getCurveId(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
    select,
  });
};
