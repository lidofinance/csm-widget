import { useLidoSWR } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useAccount } from 'shared/hooks';
import { useInvitesEventsFetcher } from './use-invites-events-fetcher';

export const useInvites = (config = STRATEGY_LAZY) => {
  const { chainId, address } = useAccount();
  const fetcher = useInvitesEventsFetcher();

  return useLidoSWR(
    ['invites', address, chainId],
    address ? fetcher : null,
    config,
  );
};
