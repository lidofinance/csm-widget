import {
  CookieThemeProvider,
  ThemeName,
  useThemeToggle,
} from '@lidofinance/lido-app-ui';
import { themeDark, themeLight } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

// Legacy lido-ui styled components read their theme from styled-components context
const LegacyThemeBridge: FC<PropsWithChildren> = ({ children }) => {
  const { themeName } = useThemeToggle();
  return (
    <StyledThemeProvider
      theme={themeName === ThemeName.dark ? themeDark : themeLight}
    >
      {children}
    </StyledThemeProvider>
  );
};

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => (
  <CookieThemeProvider>
    <LegacyThemeBridge>{children}</LegacyThemeBridge>
  </CookieThemeProvider>
);
