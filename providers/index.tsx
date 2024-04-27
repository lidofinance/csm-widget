import { CookieThemeProvider } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';

import { ConfigProvider } from 'config';
import { GlobalStyle } from 'styles';

import { AppFlagProvider } from './app-flag';
import { InpageNavigationProvider } from './inpage-navigation';
import { ModalProvider } from './modal-provider';
import { NodeOperatorPrivider } from './node-operator-provider';
import Web3Provider from './web3';

export const Providers: FC<PropsWithChildren> = ({ children }) => (
  <ConfigProvider>
    <AppFlagProvider>
      <CookieThemeProvider>
        <GlobalStyle />
        <Web3Provider>
          <NodeOperatorPrivider>
            <InpageNavigationProvider>
              <ModalProvider>{children}</ModalProvider>
            </InpageNavigationProvider>
          </NodeOperatorPrivider>
        </Web3Provider>
      </CookieThemeProvider>
    </AppFlagProvider>
  </ConfigProvider>
);
