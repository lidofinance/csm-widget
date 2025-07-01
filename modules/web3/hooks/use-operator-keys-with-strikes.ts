import { KeyWithStrikes, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import invariant from 'tiny-invariant';
import { useLidoSDK } from '../web3-provider';

export const useOperatorKeysWithStrikes = <TData = KeyWithStrikes[]>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: KeyWithStrikes[]) => TData,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['node-operator-keys-with-strikes', { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(nodeOperatorId !== undefined);
      return csm.strikes.getKeysWithStrikes(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
    select,
  });
};
