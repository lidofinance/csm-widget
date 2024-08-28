import { FC } from 'react';
import { DescriptorId, getRoleTitle } from 'shared/node-operator';
import { NodeOperatorInvite } from 'types';
import { Badge, InviteContentStyle } from './style';

export const InviteContent: FC<{ invite: NodeOperatorInvite }> = ({
  invite,
}) => (
  <InviteContentStyle>
    <DescriptorId id={invite.id} />
    <Badge>{getRoleTitle(invite.role, true)} address role</Badge>
  </InviteContentStyle>
);
