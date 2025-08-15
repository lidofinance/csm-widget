import { NodeOperatorId, NodeOperatorInfo } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useLidoSDK } from '../web3-provider';

export const KEY_OPERATOR_INFO = ['operator-info'];

export const useOperatorInfo = <TData = NodeOperatorInfo>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: NodeOperatorInfo) => TData,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: [...KEY_OPERATOR_INFO, { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(nodeOperatorId !== undefined);
      return await csm.operator.getInfo(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
    select,
  });
};
