import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import invariant from 'tiny-invariant';
import { Hex } from 'viem';
import { useLidoSDK } from '../web3-provider';

export const useOperatorKeys = <TData = Hex[]>(
  nodeOperatorId?: NodeOperatorId,
  select?: (data: Hex[]) => TData,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['node-operator-keys', { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(nodeOperatorId !== undefined);
      return csm.operator.getKeys(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
    select,
  });
};
