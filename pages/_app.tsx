import { AppProps } from 'next/app';
import Head from 'next/head';
import 'nprogress/nprogress.css';
import { memo } from 'react';

import { CookiesTooltip, ToastContainer } from '@lidofinance/lido-ui';

import { config, SecretConfigType } from 'config';
import { withCsp } from 'config/csp';
import { FaqItem } from 'lib/getFaq';
import { Providers } from 'providers';
import { FaqContext } from 'providers/faq-provider';
import { BackgroundGradient } from 'shared/components/background-gradient/background-gradient';
import { nprogress } from 'utils';

// Visualize route changes
nprogress();

const App = (props: AppProps) => {
  const { Component, pageProps } = props;

  return <Component {...pageProps} />;
};

const MemoApp = memo(App);

type AppParams = Partial<Pick<SecretConfigType, 'maintenance'>> & {
  isError?: boolean;
  faqList?: FaqItem[];
};

const AppWrapper = (props: AppProps<AppParams>): JSX.Element => {
  const { ...rest } = props;

  return (
    <FaqContext.Provider value={props.pageProps?.faqList ?? []}>
      <Providers
        dummy={props.pageProps?.maintenance}
        skipWatcher={props.pageProps?.isError}
      >
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
    </FaqContext.Provider>
  );
};

export default config.ipfsMode || process.env.NODE_ENV === 'development'
  ? AppWrapper
  : withCsp(AppWrapper);
