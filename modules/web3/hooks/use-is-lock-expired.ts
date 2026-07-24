import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const KEY_IS_LOCK_EXPIRED = ['is-lock-expired'];

export const useIsLockExpired = (
  nodeOperatorId: NodeOperatorId | undefined,
) => {
  const { operator } = useSmSDK();

  return useQuery({
    queryKey: [...KEY_IS_LOCK_EXPIRED, { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(nodeOperatorId !== undefined);
      return operator.isLockExpired(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
  });
};
