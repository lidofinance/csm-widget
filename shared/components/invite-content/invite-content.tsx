import { NodeOperatorInviteInfo } from '@lidofinance/lido-csm-sdk';
import { Tooltip } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { RoleActionsList } from 'shared/components/role-actions';
import { ROLES_METADATA } from 'consts';
import { DescriptorId } from 'shared/node-operator';
import { Badge, InviteContentStyle } from './style';

export const InviteContent: FC<{ invite: NodeOperatorInviteInfo }> = ({
  invite,
}) => {
  return (
    <InviteContentStyle>
      <DescriptorId id={invite.nodeOperatorId} />
      <Tooltip
        placement="bottomLeft"
        title={
          <RoleActionsList
            role={invite.role}
            extendedManagerPermissions={invite.extendedManagerPermissions}
          />
        }
      >
        <Badge>
          {ROLES_METADATA[invite.role].capitalizedTitle} address role
        </Badge>
      </Tooltip>
    </InviteContentStyle>
  );
};
