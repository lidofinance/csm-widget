import {
  Description,
  Hidden,
  Layout as LibLayout,
  Main,
  PageContent,
  SidebarInset,
  SidebarLayout,
  SkipLink,
  Stack as AppStack,
} from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren, ReactNode, useContext, useEffect } from 'react';

import { NodeOperatorContext } from 'modules/web3/operator-provider/node-operator-provider';
import {
  LegalDisclaimer,
  PageDisclaimerProvider,
  PageDisclaimers,
  TestEnvBanner,
} from 'shared/components';
import {
  NotificationsToasts,
  UnsupportedChainBanner,
} from 'shared/notifications';
import { trackMatomoPageEvent } from 'utils';
import { Footer } from './footer';
import { Crumb, Crumbs, useCrumbs } from './crumbs';
import { Header } from './header';
import { Navigation } from './navigation';
import s from './layout.module.css';

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
            {!mode && <NotificationsToasts />}
            <Main className={s.main}>
              <PageContent variant={fullwidth || wide ? 'default' : 'narrow'}>
                <AppStack direction="column" gap={24} align="stretch">
                  {!mode && <UnsupportedChainBanner />}
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
                  <AppStack
                    direction="column"
                    gap={12}
                    align="stretch"
                    className={s.disclaimers}
                  >
                    <PageDisclaimers />
                    <LegalDisclaimer />
                  </AppStack>
                )}
              </PageContent>
            </Main>
            <Footer dummy={mode} />
          </SidebarInset>
        </SidebarLayout>
      </LibLayout>
    </PageDisclaimerProvider>
  );
};
