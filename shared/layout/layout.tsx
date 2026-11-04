import {
  Description,
  Hidden,
  Layout as LibLayout,
  PageContent,
  SidebarInset,
  SidebarLayout,
  SkipLink,
  Stack as AppStack,
} from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren, ReactNode, useContext, useEffect } from 'react';

import { NodeOperatorContext } from 'modules/web3/operator-provider/node-operator-provider';
import { AlertContainer } from 'shared/alerts';
import {
  LegalDisclaimer,
  PageDisclaimerProvider,
  PageDisclaimers,
  TestEnvBanner,
} from 'shared/components';
import { trackMatomoPageEvent } from 'utils';
import { Footer } from './footer';
import { Crumb, Crumbs, useCrumbs } from './crumbs';
import { Header } from './header';
import { Navigation } from './navigation';
import { DisclaimersStyled, MainStyled } from './styles';

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  dummy?: boolean | 'semi';
  pageName?: string;
  fullwidth?: boolean;
  wide?: boolean;
  mainPrefix?: ReactNode;
  breadcrumbs?: Crumb[];
};

export const Layout: FC<PropsWithChildren<Props>> = ({
  children,
  dummy,
  fullwidth,
  wide,
  title,
  subtitle,
  pageName,
  mainPrefix,
  breadcrumbs,
}) => {
  const mode = useContext(NodeOperatorContext) ? dummy : true;
  const crumbs = useCrumbs(mode, title, breadcrumbs);

  useEffect(() => {
    trackMatomoPageEvent(pageName);
  }, [pageName]);

  return (
    <PageDisclaimerProvider>
      <LibLayout>
        <SkipLink />
        <TestEnvBanner />
        <SidebarLayout>
          <Navigation />
          <SidebarInset>
            <Header dummy={mode} crumbs={crumbs} />
            <MainStyled>
              {!mode && !fullwidth && <AlertContainer />}
              <PageContent variant={fullwidth || wide ? 'default' : 'narrow'}>
                <AppStack direction="column" gap={24} align="stretch">
                  <Hidden above="md" data-testid="pageTitle">
                    <Crumbs crumbs={crumbs} />
                  </Hidden>
                  {mainPrefix}
                  {subtitle && (
                    <Description
                      as="div"
                      color="secondary"
                      data-testid="pageSubtitle"
                    >
                      {subtitle}
                    </Description>
                  )}
                  {children}
                </AppStack>
                {!mode && (
                  <DisclaimersStyled
                    direction="column"
                    gap={12}
                    align="stretch"
                  >
                    <PageDisclaimers />
                    <LegalDisclaimer />
                  </DisclaimersStyled>
                )}
              </PageContent>
            </MainStyled>
            <Footer dummy={mode} />
          </SidebarInset>
        </SidebarLayout>
      </LibLayout>
    </PageDisclaimerProvider>
  );
};
