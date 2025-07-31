import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useLidoSDK } from '../web3-provider';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { NodeOperatorInfo } from '@lidofinance/lido-csm-sdk';
import invariant from 'tiny-invariant';

export const useOperatorInfo = <TData = NodeOperatorInfo>(
  id: NodeOperatorId | undefined,
  select?: (data: NodeOperatorInfo) => TData,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['node-operator-info', { id }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(id !== undefined);
      return await csm.operator.getInfo(id);
    },
    enabled: id !== undefined,
    select,
  });
};
