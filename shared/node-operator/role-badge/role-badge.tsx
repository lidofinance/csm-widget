import { FC } from 'react';

import { getShortRole } from '../utils';
import { BadgeRoleStyle } from './styles';
import { ROLES } from '@lidofinance/lido-csm-sdk/common';

export type RoleBadgeProps = {
  role?: ROLES;
};

export const RoleBadge: FC<RoleBadgeProps> = ({ role }) =>
  role ? <BadgeRoleStyle>{getShortRole(role)}</BadgeRoleStyle> : null;
