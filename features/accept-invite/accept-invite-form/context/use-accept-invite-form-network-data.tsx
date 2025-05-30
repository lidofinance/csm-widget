import { useCallback, useMemo } from 'react';
import { useAccount } from 'shared/hooks';
import { type AcceptInviteFormNetworkData } from './types';
import invariant from 'tiny-invariant';
import { useInvites } from 'modules/web3';

export const useAcceptInviteFormNetworkData = (): [
  AcceptInviteFormNetworkData,
  () => Promise<void>,
] => {
  const { address } = useAccount();
  const { data: invites, isPending: isInvitesLoading } = useInvites();

  const revalidate = useCallback(async () => {
    // await Promise.allSettled([updateInvites()]);
  }, []);

  const loading = useMemo(
    () => ({
      isInvitesLoading,
    }),
    [isInvitesLoading],
  );

  invariant(address);

  return [
    {
      invites,
      address,
      loading,
    },
    revalidate,
  ];
};
