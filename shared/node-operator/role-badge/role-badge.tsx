import { FC } from 'react';

import { BackgroundColorsType, BadgeStyle } from './styles';

export type RoleBadgeProps = {
  roleName: 'manager' | 'rewards';
  background?: BackgroundColorsType;
};

const TEXT = {
  manager: 'M',
  rewards: 'R',
} as const;

export const RoleBadge: FC<RoleBadgeProps> = ({
  roleName,
  background = 'normal',
}) => {
  const text = TEXT[roleName];

  return <BadgeStyle $background={background}>{text}</BadgeStyle>;
};
