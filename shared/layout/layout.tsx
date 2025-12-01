import { FC, PropsWithChildren, ReactNode, useEffect } from 'react';

import { AlertContainer } from 'shared/alerts';
import { trackMatomoEvent, WithMatomoEvent } from 'utils';
import { Footer } from './footer';
import { DummyHeader, Header, SemiDummyHeader } from './header';
import { Navigation } from './navigation';
import {
  Content,
  Heading,
  LayoutStyle,
  LayoutSubTitleStyle,
  LayoutTitleStyle,
  Main,
} from './styles';
import { LegalDisclaimer } from 'shared/components';

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  dummy?: boolean | 'semi';
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
      {dummy === 'semi' ? (
        <SemiDummyHeader />
      ) : dummy ? (
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
        {!dummy && <LegalDisclaimer />}
      </Main>
      <Footer />
    </LayoutStyle>
  );
};
