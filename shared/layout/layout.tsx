import { FC, PropsWithChildren, ReactNode, useEffect } from 'react';

import { AlertContainer } from 'shared/alerts';
import { LegalDisclaimer } from 'shared/components';
import { trackMatomoPageEvent } from 'utils';
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

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  dummy?: boolean | 'semi';
  pageName?: string;
};

export const Layout: FC<PropsWithChildren<Props>> = ({
  children,
  dummy,
  title,
  subtitle,
  pageName,
}) => {
  const titlesCount = [title, subtitle].filter(Boolean).length;

  useEffect(() => {
    trackMatomoPageEvent(pageName);
  }, [pageName]);

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
