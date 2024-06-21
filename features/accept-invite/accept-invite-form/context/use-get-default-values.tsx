import { useNodeOperator } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import { useAwaiter } from 'shared/hooks';
import { AcceptInviteFormInputType } from './types';

export const useGetDefaultValues = () => {
  const { invites, isInvitesLoading } = useNodeOperator();

  const values: AcceptInviteFormInputType | undefined = useMemo(() => {
    if (isInvitesLoading) return undefined;
    return { invite: invites?.[0] };
  }, [invites, isInvitesLoading]);

  const { awaiter } = useAwaiter(values);

  // FIXME: ??
  const getDefaultValues = useCallback(
    () => (values ? Promise.resolve(values) : awaiter),
    [awaiter, values],
  );

  return getDefaultValues;
};
