import { FC, PropsWithChildren, ReactNode, useContext, useEffect } from 'react';

import { NodeOperatorContext } from 'modules/web3/operator-provider/node-operator-provider';
import { AlertContainer } from 'shared/alerts';
import { LegalDisclaimer, TestEnvBanner } from 'shared/components';
import { trackMatomoPageEvent } from 'utils';
import { Footer } from './footer';
import { Crumb, useCrumbs } from './crumbs';
import { Header } from './header';
import { Navigation } from './navigation';
import {
  Column,
  Content,
  CrumbsRowStyle,
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
  breadcrumbs?: Crumb[];
};

export const Layout: FC<PropsWithChildren<Props>> = ({
  children,
  dummy,
  fullwidth,
  title,
  subtitle,
  pageName,
  mainPrefix,
  breadcrumbs,
}) => {
  const mode = useContext(NodeOperatorContext) ? dummy : true;
  const crumbs = useCrumbs(mode, title, breadcrumbs);
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
          <Header dummy={mode} crumbs={crumbs} />
          <LayoutStyle $fullwidth={fullwidth}>
            {crumbs.length > 0 && <CrumbsRowStyle crumbs={crumbs} />}
            {!mode && !fullwidth && <AlertContainer />}

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
              {!mode && <LegalDisclaimer />}
            </Main>
            <Footer dummy={mode} />
          </LayoutStyle>
        </Column>
      </Shell>
    </>
  );
};
