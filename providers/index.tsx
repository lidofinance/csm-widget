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
          <InpageNavigationProvider>
            <ModalProvider>
              {dummy ? (
                children
              ) : (
                <Web3Provider>
                  <NodeOperatorPrivider>{children}</NodeOperatorPrivider>
                </Web3Provider>
              )}
            </ModalProvider>
          </InpageNavigationProvider>
        </CookieThemeProvider>
      </ModifyProvider>
    </AppFlagProvider>
  </ConfigProvider>
);
