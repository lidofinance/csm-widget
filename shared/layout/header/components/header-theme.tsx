import { IconButton, IconDay, IconNight } from '@lidofinance/lido-app-ui';
import { ThemeName, useThemeToggle } from '@lidofinance/lido-ui';
import { useRouter } from 'next/router';
import { FC } from 'react';

const HeaderTheme: FC = () => {
  const router = useRouter();
  const { themeName, toggleTheme } = useThemeToggle();

  if (router?.query?.theme) return null;

  const isLight = themeName === ThemeName.light;

  return (
    <IconButton
      variant="surface"
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      icon={isLight ? <IconNight /> : <IconDay />}
      onClick={toggleTheme}
      data-testid="themeToggler"
    />
  );
};

export default HeaderTheme;
