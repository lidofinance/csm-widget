import { FC, PropsWithChildren, ReactNode, useEffect } from 'react';

import { AlertContainer } from 'shared/alerts';
import { trackMatomoEvent, WithMatomoEvent } from 'utils';
import { Footer } from './footer/footer';
import { DummyHeader } from './header/dummy-header';
import { Header } from './header/header';
import { Navigation } from './navigation/navigation';
import {
  Content,
  Heading,
  LayoutStyle,
  LayoutSubTitleStyle,
  LayoutTitleStyle,
  Main,
} from './styles';

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  dummy?: boolean;
};

export const Layout: FC<PropsWithChildren<WithMatomoEvent<Props>>> = ({
  children,
  dummy,
  title,
  subtitle,
  matomoEvent,
}) => {
  const titlesCount = [title, subtitle].filter(Boolean).length;

  useEffect(() => {
    trackMatomoEvent(matomoEvent);
  }, [matomoEvent]);

  return (
    <LayoutStyle>
      {dummy ? (
        <DummyHeader />
      ) : (
        <>
          <Navigation />
          <Header />
          <AlertContainer />
        </>
      )}

      <Main>
        <Heading $titlesCount={titlesCount}>
          {title && <LayoutTitleStyle>{title}</LayoutTitleStyle>}
          {subtitle && <LayoutSubTitleStyle>{subtitle}</LayoutSubTitleStyle>}
        </Heading>
        <Content>{children}</Content>
      </Main>
      <Footer />
    </LayoutStyle>
  );
};
