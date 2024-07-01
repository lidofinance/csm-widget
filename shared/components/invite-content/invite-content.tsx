import { FC } from 'react';
import { DescriptorId } from 'shared/node-operator';
import { NodeOperatorInvite } from 'types';
import { Badge, InviteContentStyle } from './style';

export const InviteContent: FC<{ invite: NodeOperatorInvite }> = ({
  invite,
}) => (
  <InviteContentStyle>
    <DescriptorId id={invite.id} />
    <Badge>{invite.manager ? 'Manager' : 'Rewards'} address role</Badge>
  </InviteContentStyle>
);
