import { Card, EmptyState } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren } from 'react';
import { useAcceptInviteFormData } from './context';

export const AcceptInviteFormGate: FC<PropsWithChildren> = ({ children }) => {
  const { invites } = useAcceptInviteFormData(true);

  if (!invites?.length) {
    return (
      <Card dataTestId={{ root: 'acceptInviteForm' }}>
        <EmptyState
          title="No pending requests"
          description="When this wallet is proposed as a new Manager or Rewards Address, the request will appear here for you to review and accept"
        />
      </Card>
    );
  }

  return <>{children}</>;
};
