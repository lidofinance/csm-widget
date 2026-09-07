import { FC } from 'react';

import { ROLES } from '@lidofinance/lido-csm-sdk';
import { ROLES_METADATA } from 'consts';
import { BadgeRoleStyle } from './styles';

export type RoleBadgeProps = {
  role?: ROLES;
};

export const RoleBadge: FC<RoleBadgeProps> = ({ role }) =>
  role ? (
    <BadgeRoleStyle data-testid="roleBadge">
      {ROLES_METADATA[role].short}
    </BadgeRoleStyle>
  ) : null;
