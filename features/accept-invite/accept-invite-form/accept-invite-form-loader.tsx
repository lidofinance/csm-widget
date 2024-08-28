import { FC, PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { AcceptInviteFormInputType, useAcceptInviteFormData } from './context';

export const AcceptInviteFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading } = useFormState<AcceptInviteFormInputType>();
  const { loading, invites } = useAcceptInviteFormData();
  const isEmpty = !invites?.length;

  return (
    <WhenLoaded
      loading={isLoading || loading.isInvitesLoading}
      empty={isEmpty && 'You don’t have any incoming requests'}
    >
      {children}
    </WhenLoaded>
  );
};
