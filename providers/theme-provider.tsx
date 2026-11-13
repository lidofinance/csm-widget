import { CookieThemeProvider } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren } from 'react';

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => (
  <CookieThemeProvider>{children}</CookieThemeProvider>
);
