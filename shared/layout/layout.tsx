import {
  Layout as LibLayout,
  PageContent,
  SidebarInset,
  SidebarLayout,
  SkipLink,
} from '@lidofinance/lido-app-ui';
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
  Content,
  Heading,
  LayoutSubTitleStyle,
  LayoutTitleStyle,
  MainStyled,
  PageBody,
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
    <LibLayout>
      <SkipLink />
      <TestEnvBanner />
      <SidebarLayout>
        <Navigation />
        <SidebarInset>
          <Header dummy={mode} crumbs={crumbs} />
          <MainStyled>
            {!mode && !fullwidth && <AlertContainer />}
            <PageContent variant={fullwidth ? 'default' : 'narrow'}>
              <PageBody>
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
              </PageBody>
              {!mode && <LegalDisclaimer />}
            </PageContent>
          </MainStyled>
          <Footer dummy={mode} />
        </SidebarInset>
      </SidebarLayout>
    </LibLayout>
  );
};
