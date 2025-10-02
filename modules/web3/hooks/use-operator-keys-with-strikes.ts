import { KeyWithStrikes, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useLidoSDK } from '../web3-provider';

export const KEY_OPERATOR_STRIKES = ['operator-strikes'];

export const useOperatorKeysWithStrikes = <TData = KeyWithStrikes[]>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: KeyWithStrikes[]) => TData,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: [...KEY_OPERATOR_STRIKES, { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(nodeOperatorId !== undefined);
      return csm.strikes.getKeysWithStrikes(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
    select,
  });
};
