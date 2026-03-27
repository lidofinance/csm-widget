import { FC, PropsWithChildren, ReactNode, useEffect } from 'react';

import { AlertContainer } from 'shared/alerts';
import { BackButton, LegalDisclaimer } from 'shared/components';
import { trackMatomoPageEvent } from 'utils';
import { Footer } from './footer';
import { DummyHeader, Header, SemiDummyHeader } from './header';
import { Navigation } from './navigation';
import {
  Content,
  FullWidthButtonWrapper,
  Heading,
  LayoutStyle,
  LayoutSubTitleStyle,
  LayoutTitleStyle,
  Main,
} from './styles';
import { PATH } from 'consts';

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  dummy?: boolean | 'semi';
  pageName?: string;
  fullwidth?: boolean;
};

export const Layout: FC<PropsWithChildren<Props>> = ({
  children,
  dummy,
  fullwidth,
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
          <Navigation desktopHidden={fullwidth} />
          <Header />
          <AlertContainer />
        </>
      )}

      {fullwidth && (
        <FullWidthButtonWrapper>
          <BackButton href={PATH.HOME} />
        </FullWidthButtonWrapper>
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
