import { memo } from 'react';
import { AppProps } from 'next/app';
import 'nprogress/nprogress.css';
import Head from 'next/head';

import {
  ToastContainer,
  CookiesTooltip,
  migrationAllowCookieToCrossDomainCookieClientSide,
  migrationThemeCookiesToCrossDomainCookiesClientSide,
} from '@lidofinance/lido-ui';

import { config } from 'config';
import { withCsp } from 'config/csp';
import { Providers } from 'providers';
import { BackgroundGradient } from 'shared/components/background-gradient/background-gradient';
import { nprogress, COOKIES_ALLOWED_FULL_KEY } from 'utils';

// Migrations old theme cookies to new cross domain cookies
migrationThemeCookiesToCrossDomainCookiesClientSide();

// Migrations old allow cookies to new cross domain cookies
migrationAllowCookieToCrossDomainCookieClientSide(COOKIES_ALLOWED_FULL_KEY);

// Visualize route changes
nprogress();

const App = (props: AppProps) => {
  const { Component, pageProps } = props;

  return <Component {...pageProps} />;
};

const MemoApp = memo(App);

const AppWrapper = (
  props: AppProps<{ notReleased?: boolean }>,
): JSX.Element => {
  const { ...rest } = props;

  return (
    <Providers dummy={props.pageProps.notReleased}>
      {/* see https://nextjs.org/docs/messages/no-document-viewport-meta */}
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>CSM | Lido</title>
      </Head>
      <BackgroundGradient
        width={1560}
        height={784}
        style={{
          opacity: 'var(--lido-color-darkThemeOpacity)',
        }}
      />
      <ToastContainer />
      <MemoApp {...rest} />
      <CookiesTooltip />
    </Providers>
  );
};

export default config.ipfsMode || process.env.NODE_ENV === 'development'
  ? AppWrapper
  : withCsp(AppWrapper);
