import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';
import { useDappStatus } from './use-dapp-status';
import { Address } from 'viem';

export const KEY_INVITES = ['invites'];

export const useInvites = (customAddress?: Address) => {
  const { address: dappAddress } = useDappStatus();
  const address = customAddress ?? dappAddress;
  const { discovery } = useSmSDK();

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
