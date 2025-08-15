import { KeyWithStatus, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useLidoSDK } from '../web3-provider';

export const KEY_OPERATOR_KEYS = ['operator-keys'];

export const useOperatorKeysWithStatus = <TData = KeyWithStatus[]>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: KeyWithStatus[]) => TData,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: [...KEY_OPERATOR_KEYS, { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(nodeOperatorId !== undefined);
      return csm.keysWithStatus.getKeys(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
    select,
  });
};
