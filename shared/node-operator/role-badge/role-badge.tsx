import { FC } from 'react';

import { BackgroundColorsType, BadgeStyle } from './styles';
import { ShortRole } from 'consts/roles';

export type RoleBadgeProps = {
  role: ShortRole;
  background?: BackgroundColorsType;
};

export const RoleBadge: FC<RoleBadgeProps> = ({
  role,
  background = 'normal',
}) => <BadgeStyle $background={background}>{role}</BadgeStyle>;
