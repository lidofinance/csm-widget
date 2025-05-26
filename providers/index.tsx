import { CookieThemeProvider } from '@lidofinance/lido-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, PropsWithChildren } from 'react';

import { ConfigProvider } from 'config';
import { GlobalStyle } from 'styles';

import { AlertProvider, AlertsWatcherPrivider } from 'shared/alerts';
import { AppFlagProvider } from './app-flag';
import { InpageNavigationProvider } from './inpage-navigation';
import { ModalProvider } from './modal-provider';
import { ModifyProvider } from './modify-provider';
import { NodeOperatorPrivider } from './node-operator-provider';
import { Web3Provider } from 'modules/web3';
import { hashKey } from 'utils';

type Props = { dummy?: boolean; skipWatcher?: boolean };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      queryKeyHashFn: hashKey,
    },
  },
});

export const Providers: FC<PropsWithChildren<Props>> = ({
  children,
  dummy,
  skipWatcher,
}) => (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider>
      <AppFlagProvider>
        <ModifyProvider>
          <CookieThemeProvider>
            <GlobalStyle />
            <InpageNavigationProvider>
              <AlertProvider>
                {dummy ? (
                  <ModalProvider>{children}</ModalProvider>
                ) : (
                  <Web3Provider>
                    <NodeOperatorPrivider>
                      <ModalProvider>
                        {skipWatcher ? (
                          children
                        ) : (
                          <AlertsWatcherPrivider>
                            {children}
                          </AlertsWatcherPrivider>
                        )}
                      </ModalProvider>
                    </NodeOperatorPrivider>
                  </Web3Provider>
                )}
              </AlertProvider>
            </InpageNavigationProvider>
          </CookieThemeProvider>
        </ModifyProvider>
      </AppFlagProvider>
    </ConfigProvider>
  </QueryClientProvider>
);
