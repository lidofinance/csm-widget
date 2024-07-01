import { FC, PropsWithChildren } from 'react';
import { TitleStyle } from './style';

export const FormTitle: FC<PropsWithChildren> = ({ children }) => (
  <TitleStyle>{children}</TitleStyle>
);
