import { NodeOperatorId } from '@lidofinance/lido-csm-sdk/common';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import invariant from 'tiny-invariant';
import { useLidoSDK } from '../web3-provider';

export const useOperatorKeysToMigrate = (nodeOperatorId?: NodeOperatorId) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['node-operator-keys-to-migrate', { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(nodeOperatorId !== undefined);
      return csm.operator.getKeysCountToMigrate(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
  });
};
