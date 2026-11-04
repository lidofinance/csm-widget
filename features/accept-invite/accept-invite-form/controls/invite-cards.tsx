import { Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { getInviteId } from 'shared/node-operator';
import { useAcceptInviteFormData } from '../context';
import { InviteCard } from './invite-card';

export const InviteCards: FC = () => {
  const { invites } = useAcceptInviteFormData(true);

  return (
    <Stack direction="column" gap={24}>
      {invites.map((invite) => (
        <InviteCard key={getInviteId(invite)} invite={invite} />
      ))}
    </Stack>
  );
};
