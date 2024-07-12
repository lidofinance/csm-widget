import { FC } from 'react';

import { BackgroundColorsType, BadgeStyle } from './styles';
import { SHORT_ROLES } from 'consts/roles';

export type RoleBadgeProps = {
  role: SHORT_ROLES;
  background?: BackgroundColorsType;
};

export const RoleBadge: FC<RoleBadgeProps> = ({
  role,
  background = 'normal',
}) => <BadgeStyle $background={background}>{role}</BadgeStyle>;
