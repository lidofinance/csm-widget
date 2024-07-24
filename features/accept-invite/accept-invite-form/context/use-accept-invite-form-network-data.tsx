import { useCallback, useMemo } from 'react';
import { useInvites } from 'shared/hooks';
import { type AcceptInviteFormNetworkData } from './types';

export const useAcceptInviteFormNetworkData = (): [
  AcceptInviteFormNetworkData,
  () => Promise<void>,
] => {
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

  return [
    {
      invites,
      loading,
    },
    revalidate,
  ];
};
