import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';
import { useDappStatus } from './use-dapp-status';

export const KEY_INVITES = ['invites'];

export const useInvites = () => {
  const { discovery } = useSmSDK();
  const { address } = useDappStatus();

  return useQuery({
    queryKey: [...KEY_INVITES, { address }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(address);
      return discovery.getNodeOperatorsByProposedAddress(address);
    },
    enabled: !!address,
  });
};
