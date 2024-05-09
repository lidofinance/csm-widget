import { ReactNode, FC, PropsWithChildren } from 'react';

import { ContainerProps } from '@lidofinance/lido-ui';

import { Header } from './header/header';
import { Footer } from './footer/footer';
import { Main } from './main/main';
import { LayoutTitleStyle, LayoutSubTitleStyle } from './styles';
import { WarningLine } from '../warning-line';
import { config } from 'config';

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  containerSize?: ContainerProps['size'];
};

export const Layout: FC<PropsWithChildren<Props>> = (props) => {
  const { title, subtitle, containerSize } = props;
  const { children } = props;

  return (
    <>
      {config.isDevnet && <WarningLine />}
      <Header />
      <Main size={containerSize}>
        <LayoutTitleStyle>{title}</LayoutTitleStyle>
        <LayoutSubTitleStyle>{subtitle}</LayoutSubTitleStyle>
        {children}
      </Main>
      <Footer />
    </>
  );
};
