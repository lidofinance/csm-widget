import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useLidoSDK } from '../web3-provider';

export const KEY_OPERATOR_KEYS_TO_MIGRATE = ['operator-keys-to-migrate'];

export const useOperatorKeysToMigrate = (
  nodeOperatorId: NodeOperatorId | undefined,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: [...KEY_OPERATOR_KEYS_TO_MIGRATE, { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(nodeOperatorId !== undefined);
      return csm.operator.getKeysCountToMigrate(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
  });
};
