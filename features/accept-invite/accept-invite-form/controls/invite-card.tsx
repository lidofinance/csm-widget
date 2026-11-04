import { Typography } from '@lidofinance/lido-app-ui';
import { ModuleInvite } from 'modules/web3';
import { FC } from 'react';
import { SubmitButton } from 'shared/form-page';
import { useDisplayOperatorType } from 'shared/hooks';
import {
  getInviteId,
  getOperatorName,
  OperatorAvatar,
  OperatorTypeTag,
} from 'shared/node-operator';
import { getProposedRoleText } from '../accept-invite-state';
import { InviteCardStyle, InviteHeaderStyle, InviteNameStyle } from '../styles';

export const InviteCard: FC<{ invite: ModuleInvite }> = ({ invite }) => {
  const inviteId = getInviteId(invite);
  const type = useDisplayOperatorType(invite);

  return (
    <InviteCardStyle
      dataTestId={{ root: 'inviteCard' }}
      data-invite-id={inviteId}
    >
      <InviteHeaderStyle>
        <OperatorAvatar operator={invite} size={40} />
        <InviteNameStyle>{getOperatorName(invite)}</InviteNameStyle>
        {type && <OperatorTypeTag type={type} />}
      </InviteHeaderStyle>
      <Typography variant="body" as="p">
        {getProposedRoleText(invite.role)}
      </Typography>
      <SubmitButton intent={inviteId}>Accept request</SubmitButton>
    </InviteCardStyle>
  );
};
