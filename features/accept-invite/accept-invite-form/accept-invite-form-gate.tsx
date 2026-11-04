import { FC, PropsWithChildren } from 'react';
import { FormCard } from 'shared/form-page';
import { useAcceptInviteFormData } from './context';

export const AcceptInviteFormGate: FC<PropsWithChildren> = ({ children }) => {
  const { invites } = useAcceptInviteFormData(true);

  if (!invites?.length) {
    return (
      <FormCard
        title="No pending requests"
        description="When this wallet is proposed as a new Manager or Rewards Address, the request will appear here for you to review and accept"
        data-testid="acceptInviteForm"
      />
    );
  }

  return <>{children}</>;
};
