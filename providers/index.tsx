import { LinkProvider } from '@lidofinance/lido-app-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, PropsWithChildren } from 'react';

import { ConfigProvider } from 'config';
import { GlobalStyle } from 'styles';

import { SurveysAuthProvider } from 'modules/surveys-sdk';
import { NodeOperatorProvider, Web3Provider } from 'modules/web3';
import { AlertProvider, AlertsWatcherProvider } from 'shared/alerts';
import { AppLink, ExternalLink, GateSupported } from 'shared/navigate';
import { SelectOperatorWatcher } from 'shared/node-operator/choose-operator-modal';
import { hashKey } from 'utils';
import { AddressValidationProvider } from './address-validation-provider';
import { AppFlagProvider } from './app-flag';
import { InpageNavigationProvider } from './inpage-navigation';
import { ModalProvider } from './modal-provider';
import { ModifyProvider } from './modify-provider';
import { ThemeProvider } from './theme-provider';

type Props = {
  dummy?: boolean;
  isError?: boolean;
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
  isError,
}) => (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider>
      <AppFlagProvider>
        <ModifyProvider>
          <ThemeProvider>
            <GlobalStyle />
            <InpageNavigationProvider>
              <AlertProvider>
                {dummy ? (
                  <LinkProvider
                    component={AppLink}
                    externalComponent={ExternalLink}
                  >
                    <ModalProvider>{children}</ModalProvider>
                  </LinkProvider>
                ) : (
                  <Web3Provider>
                    <AddressValidationProvider>
                      <NodeOperatorProvider>
                        <LinkProvider
                          component={AppLink}
                          externalComponent={ExternalLink}
                        >
                          <ModalProvider>
                            <SelectOperatorWatcher />
                            <SurveysAuthProvider>
                              {isError ? (
                                children
                              ) : (
                                <GateSupported>
                                  <AlertsWatcherProvider>
                                    {children}
                                  </AlertsWatcherProvider>
                                </GateSupported>
                              )}
                            </SurveysAuthProvider>
                          </ModalProvider>
                        </LinkProvider>
                      </NodeOperatorProvider>
                    </AddressValidationProvider>
                  </Web3Provider>
                )}
              </AlertProvider>
            </InpageNavigationProvider>
          </ThemeProvider>
        </ModifyProvider>
      </AppFlagProvider>
    </ConfigProvider>
  </QueryClientProvider>
);
