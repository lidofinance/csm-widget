import 'utils/zod-jitless';

import { withCsp } from 'config/csp';
import { config } from 'config';
import { moduleMeta } from 'consts/module';
import { AppProps } from 'next/app';
import Head from 'next/head';
import 'nprogress/nprogress.css';
import '@lidofinance/lido-shared-ui/index.css';
import { Providers } from 'providers';
import { memo } from 'react';
import {
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
  const isClient = useIsClient();
  // window.__env__ is client-only; prerendered HTML never shows maintenance
  const isMaintenance = isClient && config.maintenance;

  return (
    <Providers
      dummy={isMaintenance || pageProps?.isError || pageProps?.dummy}
      skipWatcher={pageProps?.isError}
    >
      {/* see https://nextjs.org/docs/messages/no-document-viewport-meta */}
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>{moduleMeta.shortTitle} | Lido</title>
      </Head>
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
  );
};

export default process.env.NODE_ENV === 'development'
  ? AppWrapper
  : withCsp(AppWrapper);
