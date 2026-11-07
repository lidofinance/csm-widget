import 'utils/zod-jitless';

import { config } from 'config';
import { moduleMeta } from 'consts/module';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import 'nprogress/nprogress.css';
import '@lidofinance/lido-shared-ui/index.css';
import { Providers } from 'providers';
import { memo } from 'react';
import {
  AppShellLoader,
  BackgroundGradient,
  SecurityStatusBanner,
  TestEnvBanner,
  ToastContainer,
} from 'shared/components';
import { useIsClient } from 'shared/hooks/use-is-client';
import { SVGGradientDefs } from 'shared/components/svg-gradient-defs/svg-gradient-defs';
import { nprogress } from 'utils';
import { MaintenancePage } from 'features/welcome/maintenance-page';

// Visualize route changes
nprogress();

const App = (props: AppProps) => {
  const { Component, pageProps } = props;

  return <Component {...pageProps} />;
};

const MemoApp = memo(App);

type AppParams = {
  isError?: boolean;
  dummy?: boolean;
};

const AppWrapper = (props: AppProps<AppParams>): JSX.Element => {
  const { pageProps } = props;
  const { isReady } = useRouter();
  const isClient = useIsClient();
  // Next never marks the router ready on /404
  const isMounted = isClient && (isReady || !!pageProps?.isError);
  const isMaintenance = isMounted && config.maintenance;

  return (
    <>
      {/* see https://nextjs.org/docs/messages/no-document-viewport-meta */}
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>{moduleMeta.shortTitle} | Lido</title>
      </Head>
      {isMounted ? (
        <Providers
          dummy={isMaintenance || pageProps?.isError || pageProps?.dummy}
          skipWatcher={pageProps?.isError}
        >
          <BackgroundGradient
            width={1560}
            height={784}
            style={{
              opacity: 'var(--lido-color-darkThemeOpacity)',
            }}
          />
          <SVGGradientDefs />
          <ToastContainer />
          <TestEnvBanner />
          {isMaintenance ? <MaintenancePage /> : <MemoApp {...props} />}
          <SecurityStatusBanner />
        </Providers>
      ) : (
        <AppShellLoader />
      )}
    </>
  );
};

export default AppWrapper;
