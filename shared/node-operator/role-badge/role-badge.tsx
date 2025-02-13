import { FC } from 'react';

import { ROLES } from 'consts/roles';
import { getShortRole } from '../utils';
import { BadgeRoleStyle } from './styles';

export type RoleBadgeProps = {
  role?: ROLES;
};

export const RoleBadge: FC<RoleBadgeProps> = ({ role }) =>
  role ? <BadgeRoleStyle>{getShortRole(role)}</BadgeRoleStyle> : null;
