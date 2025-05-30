import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import { useLidoSDK } from '../web3-provider';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk/common';
import invariant from 'tiny-invariant';

export const useOperatorKeysToMigrate = (id?: NodeOperatorId) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['node-operator-keys-to-migrate', { id }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(id);
      return csm.operator.getKeysCountToMigrate(id);
    },
    enabled: id !== undefined,
  });
};
