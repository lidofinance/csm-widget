import 'utils/zod-jitless';

import { config } from 'config';
import { WIDGET_TITLE } from 'consts/module';
import { AppProps } from 'next/app';
import Head from 'next/head';
import 'nprogress/nprogress.css';
import '@lidofinance/lido-app-ui/index.css';
import { Providers } from 'providers';
import { memo } from 'react';
import {
  BackgroundGradient,
  ErrorBoundary,
  SecurityStatusBanner,
  ToastContainer,
} from 'shared/components';
import { SVGGradientDefs } from 'shared/components/svg-gradient-defs/svg-gradient-defs';
import { useIsClient } from 'shared/hooks';
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
  const { ...rest } = props;
  const { isError, dummy } = props.pageProps ?? {};

  const isClient = useIsClient();
  // client-only: maintenance comes from window.__env__; prerendered HTML is built with it unset
  const isMaintenance = isClient && config.maintenance && !isError && !dummy;

  const renderApp = (dummy?: boolean) => (
    <Providers dummy={dummy} isError={isError}>
      {/* see https://nextjs.org/docs/messages/no-document-viewport-meta */}
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>{WIDGET_TITLE} | Lido</title>
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
      {isMaintenance ? <MaintenancePage /> : <MemoApp {...rest} />}
      <SecurityStatusBanner />
    </Providers>
  );

  // error pages must still render if the wallet/SDK tree is what's failing
  return isError ? (
    <ErrorBoundary fallback={renderApp(true)}>{renderApp()}</ErrorBoundary>
  ) : (
    renderApp(isMaintenance || dummy)
  );
};

export default AppWrapper;
