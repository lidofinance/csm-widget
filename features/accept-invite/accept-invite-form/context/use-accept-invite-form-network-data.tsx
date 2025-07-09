import { useDappStatus, useInvites } from 'modules/web3';
import { useCallback, useMemo } from 'react';
import invariant from 'tiny-invariant';
import { type AcceptInviteFormNetworkData } from './types';

export const useAcceptInviteFormNetworkData = (): [
  AcceptInviteFormNetworkData,
  () => Promise<void>,
] => {
  const { address } = useDappStatus();
  const {
    data: invites,
    isPending: isInvitesLoading,
    refetch: updateInvites,
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
