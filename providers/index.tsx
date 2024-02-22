import { FC, PropsWithChildren } from 'react';
import { CookieThemeProvider } from '@lidofinance/lido-ui';

import { GlobalStyle } from 'styles';
import { ConfigProvider } from 'config';

import { AppFlagProvider } from './app-flag';
import { InpageNavigationProvider } from './inpage-navigation';
import { ModalProvider } from './modal-provider';
import Web3Provider from './web3';
import { NodeOperatorPrivider } from './node-operator-provider';

export const Providers: FC<PropsWithChildren> = ({ children }) => (
  <ConfigProvider>
    <AppFlagProvider>
      <CookieThemeProvider>
        <GlobalStyle />
        <Web3Provider>
          <InpageNavigationProvider>
            <ModalProvider>
              <NodeOperatorPrivider>{children}</NodeOperatorPrivider>
            </ModalProvider>
          </InpageNavigationProvider>
        </Web3Provider>
      </CookieThemeProvider>
    </AppFlagProvider>
  </ConfigProvider>
);
