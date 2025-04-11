import { FC, PropsWithChildren, ReactNode, useEffect } from 'react';

import { ContainerProps } from '@lidofinance/lido-ui';

import { trackMatomoEvent, WithMatomoEvent } from 'utils';
import { Footer } from './footer/footer';
import { DummyHeader } from './header/dummy-header';
import { Header } from './header/header';
import { Main } from './main/main';
import {
  Content,
  Heading,
  LayoutSubTitleStyle,
  LayoutTitleStyle,
} from './styles';

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  containerSize?: ContainerProps['size'];
  dummy?: boolean;
};

export const Layout: FC<PropsWithChildren<WithMatomoEvent<Props>>> = ({
  children,
  dummy,
  title,
  subtitle,
  containerSize,
  matomoEvent,
}) => {
  const titlesCount = [title, subtitle].filter(Boolean).length;

  useEffect(() => {
    trackMatomoEvent(matomoEvent);
  }, [matomoEvent]);

  return (
    <>
      {dummy ? <DummyHeader /> : <Header />}
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
