import { FC } from 'react';

import { ROLES } from '@lidofinance/lido-csm-sdk';
import { ROLES_METADATA } from 'consts';
import { RoleActionsList } from 'shared/components/role-actions/role-actions-list';
// direct imports: the `shared/components` barrel imports back from `shared/node-operator`
import { Tooltip } from 'shared/components/tooltip/tooltip';
import { BadgeRoleStyle } from './styles';

export type RoleBadgeProps = {
  role?: ROLES;
  extendedManagerPermissions?: boolean;
};

export const RoleBadge: FC<RoleBadgeProps> = ({
  role,
  extendedManagerPermissions = false,
}) =>
  role ? (
    <Tooltip
      title={
        <RoleActionsList
          role={role}
          extendedManagerPermissions={extendedManagerPermissions}
        />
      }
    >
      <BadgeRoleStyle>{ROLES_METADATA[role].short}</BadgeRoleStyle>
    </Tooltip>
  ) : null;
