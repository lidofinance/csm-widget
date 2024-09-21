import { CookieThemeProvider } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';

import { ConfigProvider } from 'config';
import { GlobalStyle } from 'styles';

import { AppFlagProvider } from './app-flag';
import { InpageNavigationProvider } from './inpage-navigation';
import { ModalProvider } from './modal-provider';
import { ModifyProvider } from './modify-provider';
import { NodeOperatorPrivider } from './node-operator-provider';
import Web3Provider from './web3';
import { AlertProvider, AlertsWatcherPrivider } from 'shared/alerts';

type Props = { dummy?: boolean; skipWatcher?: boolean };

export const Providers: FC<PropsWithChildren<Props>> = ({
  children,
  dummy,
  skipWatcher,
}) => (
  <ConfigProvider>
    <AppFlagProvider>
      <ModifyProvider>
        <CookieThemeProvider>
          <GlobalStyle />
          <InpageNavigationProvider>
            <ModalProvider>
              <AlertProvider>
                {dummy ? (
                  children
                ) : (
                  <Web3Provider>
                    <NodeOperatorPrivider>
                      {skipWatcher ? (
                        children
                      ) : (
                        <AlertsWatcherPrivider>
                          {children}
                        </AlertsWatcherPrivider>
                      )}
                    </NodeOperatorPrivider>
                  </Web3Provider>
                )}
              </AlertProvider>
            </ModalProvider>
          </InpageNavigationProvider>
        </CookieThemeProvider>
      </ModifyProvider>
    </AppFlagProvider>
  </ConfigProvider>
);
