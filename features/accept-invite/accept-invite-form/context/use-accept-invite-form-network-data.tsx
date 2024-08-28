import { useCallback, useMemo } from 'react';
import { useAccount, useInvites } from 'shared/hooks';
import { type AcceptInviteFormNetworkData } from './types';
import invariant from 'tiny-invariant';

export const useAcceptInviteFormNetworkData = (): [
  AcceptInviteFormNetworkData,
  () => Promise<void>,
] => {
  const { address } = useAccount();
  const {
    data: invites,
    initialLoading: isInvitesLoading,
    update: updateInvites,
  } = useInvites();

  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateInvites()]);
  }, [updateInvites]);

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
