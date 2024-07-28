import { FC, PropsWithChildren } from 'react';
import { UlStyle } from './style';

export const Ul: FC<PropsWithChildren> = ({ children }) => (
  <UlStyle>{children}</UlStyle>
);
