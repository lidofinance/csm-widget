import {
  Layout as LibLayout,
  MobilePageTitle,
  PageContent,
  SidebarInset,
  SidebarLayout,
  SkipLink,
  Stack as AppStack,
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
import { MainStyled, Subtitle } from './styles';

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
              <AppStack direction="column" gap={24} align="stretch">
                {mainPrefix}
                {(title || subtitle) && (
                  <AppStack direction="column" gap={4}>
                    {title && (
                      <MobilePageTitle data-testid="pageTitle">
                        {title}
                      </MobilePageTitle>
                    )}
                    {subtitle && (
                      <Subtitle data-testid="pageSubtitle">{subtitle}</Subtitle>
                    )}
                  </AppStack>
                )}
                {children}
              </AppStack>
              {!mode && <LegalDisclaimer />}
            </PageContent>
          </MainStyled>
          <Footer dummy={mode} />
        </SidebarInset>
      </SidebarLayout>
    </LibLayout>
  );
};
