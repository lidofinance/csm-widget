import { NodeOperatorInvite, ROLES } from '@lidofinance/lido-csm-sdk';
import { Tooltip } from '@lidofinance/lido-ui';
import { ROLES_METADATA } from 'consts';
import { FC } from 'react';
import { DescriptorId } from 'shared/node-operator';
import { Badge, InviteContentStyle } from './style';

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
            The Manager Address is used for:
            <ul>
              <li>Adding new keys</li>
              <li>Removing existing keys</li>
              <li>Adding extra bond amount</li>
              <li>Claiming bond and rewards to the Rewards Address</li>
              <li>Covering locked bond</li>
              <li>Proposing a new Manager Address</li>
            </ul>
          </>
        ) : (
          <>
            The Rewards Address is used for:
            <ul>
              <li>Claiming bond and rewards</li>
              <li>Adding extra bond amount</li>
              <li>Covering locked bond</li>
              <li>Proposing a new Rewards Address</li>
              <li>
                Resetting the Manager Address to the current Rewards Address
              </li>
            </ul>
          </>
        )
      }
    >
      <Badge>{ROLES_METADATA[invite.role].capitalizedTitle} address role</Badge>
    </Tooltip>
  </InviteContentStyle>
);
