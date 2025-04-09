import {
  themeDark,
  themeLight,
  ThemeName,
  ThemeProvider,
  useThemeToggle,
} from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';

export const InverseThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const { themeName } = useThemeToggle();
  return (
    <ThemeProvider
      theme={themeName === ThemeName.light ? themeDark : themeLight}
    >
      {children}
    </ThemeProvider>
  );
};
