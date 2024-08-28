import { FC } from 'react';

import { ROLES } from 'consts/roles';
import { BadgeStyle } from './styles';
import { getShortRole } from '../utils';

export type RoleBadgeProps = {
  role?: ROLES;
};

export const RoleBadge: FC<RoleBadgeProps> = ({ role }) =>
  role ? <BadgeStyle>{getShortRole(role)}</BadgeStyle> : null;
