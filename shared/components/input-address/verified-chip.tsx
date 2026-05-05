import { FC, PropsWithChildren } from 'react';
import { ChipProps, VerifiedIcon, StyledChip } from './styles';

export const VerifiedChip: FC<PropsWithChildren<ChipProps>> = ({
  children,
  color,
}) => (
  <StyledChip color={color} data-testid="verifiedChip">
    {children}
    <VerifiedIcon color={color} />
  </StyledChip>
);
