import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useLidoSDK } from '../web3-provider';
import { useDappStatus } from './use-dapp-status';
import invariant from 'tiny-invariant';

export const KEY_INVITES = ['invites'];

export const useInvites = () => {
  const { csm } = useLidoSDK();
  const { address } = useDappStatus();

  return useQuery({
    queryKey: [...KEY_INVITES, { address }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(address);
      return csm.satellite.getNodeOperatorsByProposedAddress(address);
    },
    enabled: !!address,
  });
};
