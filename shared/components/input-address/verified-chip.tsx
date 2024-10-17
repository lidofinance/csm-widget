import { FC, PropsWithChildren } from 'react';
import { Icon, StyledChip } from './styles';

export const VerifiedChip: FC<PropsWithChildren> = ({ children }) => (
  <StyledChip>
    {children}
    <Icon />
  </StyledChip>
);
