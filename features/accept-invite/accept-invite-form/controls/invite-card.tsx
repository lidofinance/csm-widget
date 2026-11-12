import { Card, Stack, Typography } from '@lidofinance/lido-app-ui';
import { ModuleInvite } from 'modules/web3';
import { FC } from 'react';
import { GasCostList, SubmitButton } from 'shared/form-page';
import { useDisplayOperatorType } from 'shared/hooks';
import {
  getInviteId,
  getOperatorName,
  OperatorAvatar,
  OperatorTypeTag,
} from 'shared/node-operator';
import { getProposedRoleText } from '../accept-invite-state';
import { InviteNameStyle } from '../styles';

export const InviteCard: FC<{ invite: ModuleInvite }> = ({ invite }) => {
  const inviteId = getInviteId(invite);
  const type = useDisplayOperatorType(invite);

  return (
    <Card dataTestId={{ root: 'inviteCard' }} data-invite-id={inviteId}>
      <Stack direction="column" align="start" gap={16}>
        <Stack direction="row" align="center" gap={12} style={{ minWidth: 0 }}>
          <OperatorAvatar operator={invite} size={40} />
          <InviteNameStyle>{getOperatorName(invite)}</InviteNameStyle>
          {type && <OperatorTypeTag type={type} />}
        </Stack>
        <Typography variant="body" as="p">
          {getProposedRoleText(invite.role)}
        </Typography>
        <GasCostList intent={inviteId} />
        <SubmitButton intent={inviteId} size="small" fullWidth={false}>
          Accept request
        </SubmitButton>
      </Stack>
    </Card>
  );
};
