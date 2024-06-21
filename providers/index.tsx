import { CookieThemeProvider } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';

import { ConfigProvider } from 'config';
import { GlobalStyle } from 'styles';

import { AppFlagProvider } from './app-flag';
import { InpageNavigationProvider } from './inpage-navigation';
import { ModalProvider } from './modal-provider';
import Web3Provider from './web3';

export const Providers: FC<PropsWithChildren> = ({ children }) => (
  <ConfigProvider>
    <AppFlagProvider>
      <CookieThemeProvider>
        <GlobalStyle />
        <Web3Provider>
          <InpageNavigationProvider>
            <ModalProvider>{children}</ModalProvider>
          </InpageNavigationProvider>
        </Web3Provider>
      </CookieThemeProvider>
    </AppFlagProvider>
  </ConfigProvider>
);
