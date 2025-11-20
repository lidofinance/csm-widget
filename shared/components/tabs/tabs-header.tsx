import { FC, PropsWithChildren } from 'react';
import { TabListStyled } from './styles';

export const TabsHeader: FC<PropsWithChildren> = ({ children }) => {
  return <TabListStyled>{children}</TabListStyled>;
};
