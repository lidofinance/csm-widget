import { FC, PropsWithChildren } from 'react';
import { ChipProps, Icon, StyledChip } from './styles';

export const VerifiedChip: FC<PropsWithChildren<ChipProps>> = ({
  children,
  color,
}) => (
  <StyledChip color={color}>
    {children}
    <Icon color={color} />
  </StyledChip>
);
