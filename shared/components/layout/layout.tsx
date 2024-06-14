import { ReactNode, FC, PropsWithChildren } from 'react';

import { ContainerProps } from '@lidofinance/lido-ui';

import { Header } from './header/header';
import { Footer } from './footer/footer';
import { Main } from './main/main';
import {
  LayoutTitleStyle,
  LayoutSubTitleStyle,
  Heading,
  Content,
} from './styles';
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
  const titlesCount = [title, subtitle].filter(Boolean).length;

  return (
    <>
      {config.isDevnet && <WarningLine />}
      <Header />
      <Main size={containerSize}>
        <Heading $titlesCount={titlesCount}>
          {title && <LayoutTitleStyle>{title}</LayoutTitleStyle>}
          {subtitle && <LayoutSubTitleStyle>{subtitle}</LayoutSubTitleStyle>}
        </Heading>
        <Content>{children}</Content>
      </Main>
      <Footer />
    </>
  );
};
