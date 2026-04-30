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
  fullwidth?: boolean;
  mainPrefix?: ReactNode;
};

export const Layout: FC<PropsWithChildren<Props>> = ({
  children,
  dummy,
  fullwidth,
  title,
  subtitle,
  pageName,
  mainPrefix,
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
          <Navigation desktopHidden={fullwidth} />
          <Header />
          {!fullwidth && <AlertContainer />}
        </>
      )}

      <Main>
        {mainPrefix}
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
