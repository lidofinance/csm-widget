import { CookieThemeProvider } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';

import { ConfigProvider } from 'config';
import { GlobalStyle } from 'styles';

import { AppFlagProvider } from './app-flag';
import { InpageNavigationProvider } from './inpage-navigation';
import { ModalProvider } from './modal-provider';
import { ModifyProvider } from './modify-provider';
import { AddressValidationProvider } from './address-validation-provider';
import { AddressValidationFile } from 'utils/address-validation';
import { NodeOperatorPrivider } from './node-operator-provider';
import Web3Provider from './web3';
import { AlertProvider, AlertsWatcherPrivider } from 'shared/alerts';

type Props = {
  dummy?: boolean;
  skipWatcher?: boolean;
  validationFile?: AddressValidationFile;
};

export const Providers: FC<PropsWithChildren<Props>> = ({
  children,
  dummy,
  skipWatcher,
  validationFile,
}) => (
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
                  <AddressValidationProvider validationFile={validationFile}>
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
                  </AddressValidationProvider>
                </Web3Provider>
              )}
            </AlertProvider>
          </InpageNavigationProvider>
        </CookieThemeProvider>
      </ModifyProvider>
    </AppFlagProvider>
  </ConfigProvider>
);
