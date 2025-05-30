import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import { useLidoSDK } from '../web3-provider';
import { useDappStatus } from './use-dapp-status';

export const useInvites = () => {
  const { csm } = useLidoSDK();
  const { address } = useDappStatus();

  return useQuery({
    queryKey: ['invites', { address }],
    ...STRATEGY_CONSTANT,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: async () => csm.events.getInvitesByAddress(address!),
    enabled: !!address,
  });
};
