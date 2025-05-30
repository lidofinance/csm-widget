import { FC } from 'react';
import { DescriptorId, getRoleTitle } from 'shared/node-operator';
import { Badge, InviteContentStyle } from './style';
import { Tooltip } from '@lidofinance/lido-ui';
import { ROLES } from 'consts/roles';
import { NodeOperatorInvite } from '@lidofinance/lido-csm-sdk/common';

export const InviteContent: FC<{ invite: NodeOperatorInvite }> = ({
  invite,
}) => (
  <InviteContentStyle>
    <DescriptorId id={invite.id} />
    <Tooltip
      placement="bottomLeft"
      title={
        invite.role === ROLES.MANAGER ? (
          <>
            The Manager address is used for:
            <ul>
              <li>Adding new keys</li>
              <li>Removing existing keys</li>
              <li>Adding extra bond amount</li>
              <li>Claiming bond and rewards to the Rewards address</li>
              <li>Covering locked bond</li>
              <li>Proposing a new Manager address</li>
            </ul>
          </>
        ) : (
          <>
            The Rewards address is used for:
            <ul>
              <li>Claiming bond and rewards</li>
              <li>Adding extra bond amount</li>
              <li>Covering locked bond</li>
              <li>Proposing a new Rewards address</li>
              <li>
                Resetting the Manager address to the current Rewards address
              </li>
            </ul>
          </>
        )
      }
    >
      <Badge>{getRoleTitle(invite.role, true)} address role</Badge>
    </Tooltip>
  </InviteContentStyle>
);
