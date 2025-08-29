import { CookieThemeProvider } from '@lidofinance/lido-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, PropsWithChildren } from 'react';

import { ConfigProvider } from 'config';
import { GlobalStyle } from 'styles';

import { NodeOperatorPrivider, Web3Provider } from 'modules/web3';
import { AlertProvider, AlertsWatcherPrivider } from 'shared/alerts';
import { GateSupported } from 'shared/navigate';
import { hashKey } from 'utils';
import { AppFlagProvider } from './app-flag';
import { InpageNavigationProvider } from './inpage-navigation';
import { ModalProvider } from './modal-provider';
import { ModifyProvider } from './modify-provider';
import { AddressValidationProvider } from './address-validation-provider';
import { AddressValidationFile } from 'utils/address-validation';

type Props = {
  dummy?: boolean;
  skipWatcher?: boolean;
  validationFile?: AddressValidationFile;
};

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
  validationFile,
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
                    <AddressValidationProvider validationFile={validationFile}>
                      <GateSupported>
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
                      </GateSupported>
                    </AddressValidationProvider>
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
