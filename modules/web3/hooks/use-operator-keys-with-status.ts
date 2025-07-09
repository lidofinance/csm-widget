import { KeyWithStatus, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useLidoSDK } from '../web3-provider';

export const useOperatorKeysWithStatus = <TData = KeyWithStatus[]>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: KeyWithStatus[]) => TData,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['node-operator-keys-with-status', { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(nodeOperatorId !== undefined);
      return csm.keysWithStatus.getKeys(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
    select,
  });
};
