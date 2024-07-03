import { FC, PropsWithChildren } from 'react';
import { LaticeStyle } from './style';

export const Latice: FC<PropsWithChildren> = ({ children }) => (
  <LaticeStyle>{children}</LaticeStyle>
);
