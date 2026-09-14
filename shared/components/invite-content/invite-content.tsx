import { ModuleInvite } from 'modules/web3';
import { Tooltip } from '../tooltip/tooltip';
import { FC } from 'react';
import { RoleActionsList } from 'shared/components/role-actions';
import { ROLES_METADATA } from 'consts';
import { CurveBadge, DescriptorId } from 'shared/node-operator';
import { Badge, InviteContentStyle } from './style';

export const InviteContent: FC<{ invite: ModuleInvite }> = ({ invite }) => {
  return (
    <InviteContentStyle>
      <DescriptorId id={invite.nodeOperatorId} />
      <CurveBadge curve={invite} inline />
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
          {ROLES_METADATA[invite.role].capitalizedTitle} Address role
        </Badge>
      </Tooltip>
    </InviteContentStyle>
  );
};
