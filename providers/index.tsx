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

export const Providers: FC<PropsWithChildren<{ dummy?: boolean }>> = ({
  children,
  dummy,
}) => (
  <ConfigProvider>
    <AppFlagProvider>
      <ModifyProvider>
        <CookieThemeProvider>
          <GlobalStyle />
          {dummy ? (
            <InpageNavigationProvider>
              <ModalProvider>{children}</ModalProvider>
            </InpageNavigationProvider>
          ) : (
            <Web3Provider>
              <NodeOperatorPrivider>
                <InpageNavigationProvider>
                  <ModalProvider>{children}</ModalProvider>
                </InpageNavigationProvider>
              </NodeOperatorPrivider>
            </Web3Provider>
          )}
        </CookieThemeProvider>
      </ModifyProvider>
    </AppFlagProvider>
  </ConfigProvider>
);
