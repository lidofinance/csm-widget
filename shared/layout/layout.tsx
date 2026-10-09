import { FC, PropsWithChildren, ReactNode, useEffect } from 'react';

import { AlertContainer } from 'shared/alerts';
import { LegalDisclaimer, TestEnvBanner } from 'shared/components';
import { trackMatomoPageEvent } from 'utils';
import { Footer } from './footer';
import { DummyHeader, Header, SemiDummyHeader } from './header';
import { Navigation } from './navigation';
import {
  Column,
  Content,
  Heading,
  LayoutStyle,
  LayoutSubTitleStyle,
  LayoutTitleStyle,
  Main,
  Shell,
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
    <>
      <TestEnvBanner />
      <Shell>
        <Navigation />
        <Column>
          <LayoutStyle $fullwidth={fullwidth}>
            {dummy === 'semi' ? (
              <SemiDummyHeader />
            ) : dummy ? (
              <DummyHeader />
            ) : (
              <>
                <Header />
                {!fullwidth && <AlertContainer />}
              </>
            )}

            <Main>
              {mainPrefix}
              <Heading $titlesCount={titlesCount}>
                {title && (
                  <LayoutTitleStyle data-testid="pageTitle">
                    {title}
                  </LayoutTitleStyle>
                )}
                {subtitle && (
                  <LayoutSubTitleStyle data-testid="pageSubtitle">
                    {subtitle}
                  </LayoutSubTitleStyle>
                )}
              </Heading>
              <Content>{children}</Content>
              {!dummy && <LegalDisclaimer />}
            </Main>
            <Footer dummy={dummy} />
          </LayoutStyle>
        </Column>
      </Shell>
    </>
  );
};
